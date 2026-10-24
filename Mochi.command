#!/bin/bash
#
# Mochi 一键启停（macOS）—— 文档站与 playground
#
#   双击本文件              打开/关闭文档站（全部组件的完整演示）
#   ./Mochi.command start|stop|restart|status|logs      playground 开发沙盒（直连源码，热更新）
#   ./Mochi.command docs                               文档站（自动构建后提供静态服务）
#   ./Mochi.command status|stop ... 也可加 docs 针对文档站，如 ./Mochi.command status docs
#
# 说明：
#   - 服务器以 nohup 方式脱离终端运行，关掉 Terminal 窗口不会中断；
#   - 状态判定看「端口监听进程的工作目录 + 是否为 node」是否属于本仓库的服务，不会把别的项目误判成在运行；
#   - 默认端口被占用时先自动释放（结束占用进程），释放失败再向上换一个空闲端口，
#     实际端口记在 .run/；
#   - 停服按进程树收敛，不会留下孤儿 node 进程。
#
set -uo pipefail

SELF="${BASH_SOURCE[0]:-$0}"
ROOT="$(cd "$(dirname "$SELF")" && pwd)"
cd "$ROOT" || exit 1

RUN_DIR="$ROOT/.run"
DOCS_DIST="$ROOT/docs/.vitepress/dist/index.html"

if [ -t 1 ]; then
  B=$'\033[1m'; DIM=$'\033[2m'; OK=$'\033[32m'; WARN=$'\033[33m'; ERR=$'\033[31m'; OFF=$'\033[0m'
else
  B=''; DIM=''; OK=''; WARN=''; ERR=''; OFF=''
fi

say() { printf '%s\n' "$*"; }

# ---------- 每个服务一份运行档案：playground 用 vite 开发服务器，docs 用 vitepress preview ----------
service_file() { printf '%s/%s.%s' "$RUN_DIR" "$1" "$2"; }

# 端口来源：显式指定（MOCHI_PORT / MOCHI_DOCS_PORT）> 上次运行记录 > 默认值
service_port() {
  local svc="$1" default="$2" env_port=""
  if [ "$svc" = "playground" ]; then env_port="${MOCHI_PORT:-}"
  else env_port="${MOCHI_DOCS_PORT:-}"; fi
  if [ -n "$env_port" ]; then printf '%s' "$env_port"
  elif [ -s "$(service_file "$svc" port)" ]; then cat "$(service_file "$svc" port)"
  else printf '%s' "$default"; fi
}

# 启动命令：打印后由 start_service 用 nohup 执行
service_start_cmd() {
  if [ "$1" = "playground" ]; then
    printf 'pnpm --dir %s/playground exec vite --port %s --strictPort' "$ROOT" "$2"
  else
    printf 'pnpm --dir %s/docs exec vitepress preview --port %s --strictPort' "$ROOT" "$2"
  fi
}

# Finder 双击时 PATH 很短，补齐常见 Node 安装位置
ensure_toolchain() {
  for dir in /opt/homebrew/bin /usr/local/bin "$HOME/.local/share/pnpm" "$HOME/Library/pnpm"; do
    [ -d "$dir" ] && PATH="$dir:$PATH"
  done
  if [ -s "$HOME/.nvm/nvm.sh" ] && ! command -v pnpm >/dev/null 2>&1; then
    # shellcheck disable=SC1091
    . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1 || true
  fi
  export PATH

  if ! command -v pnpm >/dev/null 2>&1; then
    say "${ERR}✗ 找不到 pnpm${OFF}，请先执行：npm i -g pnpm"
    return 1
  fi
}

listener_pid() { lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null | head -n 1; }

port_is_free() { [ -z "$(lsof -nP -iTCP:"$1" -sTCP:LISTEN -t 2>/dev/null | head -n 1)" ]; }

recorded_pid() {
  local svc pid
  svc="${1:-playground}"
  pid="$(cat "$(service_file "$svc" pid)" 2>/dev/null || true)"
  case "$pid" in ''|0|1) printf '' ;; *) printf '%s' "$pid" ;; esac
}

# 监听进程的工作目录（比 ps 更可靠，且不受沙箱对 ps 的限制）
listener_cwd() {
  lsof -p "$1" -a -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -n 1
}

# 监听进程的命令名（node / Python / …），用于区分「我们的 node 服务」和「恰好从仓库目录启动的进程」
listener_cmd() {
  lsof -p "$1" -Fcp 2>/dev/null | sed -n 's/^c//p' | head -n 1
}

is_running() {
  local port pid cwd cmd
  port="$1"
  pid="$(listener_pid "$port")"
  [ -n "$pid" ] || return 1
  # pid 文件对得上：一定是我们起的这个服务
  [ "$pid" = "$(recorded_pid "$2")" ] && return 0
  cwd="$(listener_cwd "$pid")"
  case "$cwd" in "$ROOT"|"$ROOT"/*) ;;
    *) return 1 ;;
  esac
  # cwd 在仓库内还不够——从仓库目录启动的任何进程都会命中，
  # 必须同时确认监听进程确实是 node（vite / vitepress 都是 node）
  cmd="$(listener_cmd "$pid")"
  case "$cmd" in
    node|vite|vitepress|Node|nodejs) return 0 ;;
    *) return 1 ;;
  esac
}

kill_tree() {
  local parent="${1:-}"
  # 0 表示当前进程组，误传会连终端一起杀掉，必须拦截
  case "$parent" in ''|0|1) return 0 ;; esac
  local child
  for child in $(pgrep -P "$parent" 2>/dev/null); do
    kill_tree "$child"
  done
  kill -TERM "$parent" 2>/dev/null || true
}

install_if_needed() {
  if [ ! -d "$ROOT/node_modules" ]; then
    say "${DIM}… 首次运行，安装依赖（pnpm install）${OFF}"
    pnpm install || { say "${ERR}✗ 依赖安装失败，请查看上方输出${OFF}"; return 1; }
  fi
}

# 从当前端口往上找一个空闲端口
next_free_port() {
  local p="$1" limit=$((p + 20))
  while [ "$p" -lt "$limit" ]; do
    if port_is_free "$p"; then printf '%s' "$p"; return 0; fi
    p=$((p + 1))
  done
  return 1
}

# 端口被占用时自动释放：逐个结束监听进程（TERM 整棵进程树 → 3s 不走升级 KILL）
release_port() {
  local port="$1" pid waited
  for pid in $(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null); do
    say "${WARN}… 端口 ${port} 被 pid ${pid} 占用，正在释放${OFF}"
    kill_tree "$pid"
  done
  waited=0
  while [ "$waited" -lt 12 ]; do
    port_is_free "$port" && return 0
    sleep 0.25
    waited=$((waited + 1))
  done
  for pid in $(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null); do
    kill -KILL "$pid" 2>/dev/null || true
  done
  waited=0
  while [ "$waited" -lt 8 ]; do
    port_is_free "$port" && return 0
    sleep 0.25
    waited=$((waited + 1))
  done
  return 1
}

# docs 服务的前置：dist 不存在（或源码比 dist 新）就先构建
ensure_docs_dist() {
  ensure_toolchain || return 1
  install_if_needed || return 1
  if [ ! -s "$DOCS_DIST" ]; then
    say "${DIM}… 文档站尚未构建，执行 docs:build（第一次约半分钟）${OFF}"
    pnpm docs:build >/dev/null 2>&1 || { say "${ERR}✗ 文档站构建失败，请手动执行 pnpm docs:build 查看输出${OFF}"; return 1; }
  fi
}

start_service() {
  local svc="$1" default_port="$2" port pid_file log_file
  port="$(service_port "$svc" "$default_port")"
  pid_file="$(service_file "$svc" pid)"
  log_file="$(service_file "$svc" log)"

  if is_running "$port" "$svc"; then
    # 端口记录与实际对齐，避免"换过端口后 pid 文件与 port 文件不一致"
    printf '%s' "$port" > "$(service_file "$svc" port)"
    say "${WARN}● $svc 已在运行${OFF}  http://localhost:$port  ${DIM}(pid $(listener_pid "$port"))${OFF}"
    return 0
  fi

  # 端口被占用：先自动释放（结束占用进程），释放失败才让位到下一个空闲端口
  if ! port_is_free "$port"; then
    release_port "$port" || true
    if ! port_is_free "$port"; then
      local explicit="${MOCHI_PORT:-}"
      [ "$svc" = "docs" ] && explicit="${MOCHI_DOCS_PORT:-}"
      if [ -n "$explicit" ]; then
        say "${ERR}✗ 端口 ${port} 释放失败，仍被 pid $(listener_pid "$port") 占用${OFF}"
        return 1
      fi
      local free_port
      free_port="$(next_free_port $((port + 1)))" || {
        say "${ERR}✗ ${port} 附近没有空闲端口${OFF}"
        return 1
      }
      say "${WARN}… 端口 ${port} 无法释放，改用 ${free_port}${OFF}"
      port="$free_port"
    fi
  fi

  if [ "$svc" = "docs" ]; then
    ensure_docs_dist || return 1
  else
    ensure_toolchain || return 1
    install_if_needed || return 1
  fi

  mkdir -p "$RUN_DIR"
  : > "$log_file"
  printf '%s' "$port" > "$(service_file "$svc" port)"

  local label="Playground"
  [ "$svc" = "docs" ] && label="文档站"
  say "${DIM}… 启动 ${svc} ，日志：${log_file#"$ROOT"/}${OFF}"
  # nohup + 后台：SIGHUP 被忽略，关闭终端不会带走服务
  nohup bash -c "$(service_start_cmd "$svc" "$port")" >"$log_file" 2>&1 &
  echo $! > "$pid_file"

  waited=0
  while [ "$waited" -lt 80 ]; do
    if is_running "$port" "$svc"; then
      say "${OK}✓ Mochi $label 已启动${OFF}  ${B}http://localhost:$port${OFF}"
      say "${DIM}  再次执行本脚本可关闭（./Mochi.command $([ "$svc" = "docs" ] && echo docs || echo stop)）${OFF}"
      if [ "${MOCHI_NO_OPEN:-0}" != "1" ]; then open "http://localhost:$port"; fi
      return 0
    fi
    if [ -n "$(recorded_pid "$svc")" ] && ! kill -0 "$(recorded_pid "$svc")" 2>/dev/null; then
      break
    fi
    sleep 0.5
    waited=$((waited + 1))
  done

  say "${ERR}✗ 启动失败${OFF}，最近日志："
  tail -n 20 "$log_file" 2>/dev/null
  # 失败也要收敛：包装进程（bash/pnpm）可能还活着但服务没起来，不留孤儿
  if [ -n "$(recorded_pid "$svc")" ]; then
    kill_tree "$(recorded_pid "$svc")"
  fi
  rm -f "$pid_file"
  return 1
}

stop_service() {
  local svc="$1" port pid_file log_file
  port="$(service_port "$svc" "$([ "$svc" = "docs" ] && echo 4181 || echo 5173)")"
  pid_file="$(service_file "$svc" pid)"
  log_file="$(service_file "$svc" log)"

  if ! is_running "$port" "$svc"; then
    rm -f "$pid_file"
    say "${WARN}○ $svc 未在运行${OFF}  ${DIM}http://localhost:$port${OFF}"
    return 0
  fi

  if [ -n "$(recorded_pid "$svc")" ]; then
    kill_tree "$(recorded_pid "$svc")"
  fi
  # 兜底：收敛端口上的本项目进程（例如 pid 文件被清掉）
  local pid
  for pid in $(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null); do
    kill -TERM "$pid" 2>/dev/null || true
  done

  waited=0
  while [ "$waited" -lt 20 ]; do
    is_running "$port" "$svc" || break
    sleep 0.25
    waited=$((waited + 1))
  done

  if is_running "$port" "$svc"; then
    for pid in $(lsof -nP -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null); do
      kill -KILL "$pid" 2>/dev/null || true
    done
  fi

  rm -f "$pid_file"
  say "${OK}✓ $svc 已关闭${OFF}  ${DIM}http://localhost:$port${OFF}"
}

show_status() {
  local port
  port="$(service_port playground 5173)"
  if is_running "$port" playground; then
    say "${OK}● playground 运行中${OFF}  http://localhost:$port  ${DIM}pid $(listener_pid "$port")${OFF}"
  elif ! port_is_free "$port"; then
    say "${WARN}○ playground 未运行${OFF}  ${DIM}（端口 ${port} 被其它进程占用）${OFF}"
  else
    say "${WARN}○ playground 未运行${OFF}  ${DIM}http://localhost:$port${OFF}"
  fi

  port="$(service_port docs 4181)"
  if is_running "$port" docs; then
    say "${OK}● docs 运行中${OFF}        http://localhost:$port  ${DIM}pid $(listener_pid "$port")${OFF}"
  elif ! port_is_free "$port"; then
    say "${WARN}○ docs 未运行${OFF}        ${DIM}（端口 ${port} 被其它进程占用）${OFF}"
  else
    say "${WARN}○ docs 未运行${OFF}        ${DIM}http://localhost:$port${OFF}"
  fi
  say "${DIM}日志：.run/*.log${OFF}"
}

show_logs() {
  local svc="${1:-playground}"
  local log_file
  log_file="$(service_file "$svc" log)"
  [ -f "$log_file" ] || { say "${WARN}暂无日志${OFF}"; return 0; }
  if [ -t 1 ]; then tail -n 40 -f "$log_file"; else tail -n 40 "$log_file"; fi
}

finish() {
  # 只有从 Terminal / iTerm 直接运行时才停一下，脚本化调用不阻塞
  if [ -n "${TERM_PROGRAM:-}" ] && [ "${MOCHI_NO_PAUSE:-0}" != "1" ]; then
    printf '\n%s按回车关闭此窗口…%s' "$DIM" "$OFF"
    read -r _ || true
  fi
}

svc_of() {
  case "${2:-playground}" in
    playground|play|dev) printf 'playground' ;;
    docs|doc) printf 'docs' ;;
    *) printf '' ;;
  esac
}

case "${1:-toggle}" in
  start)   start_service playground 5173; finish ;;
  stop)    stop_service playground; finish ;;
  restart) stop_service playground; start_service playground 5173; finish ;;
  status)  show_status; finish ;;
  logs)    show_logs "$(svc_of logs "${2:-}")" ;;
  docs)
    case "${2:-toggle}" in
      toggle|'')  # 双击语义：运行中则关，未运行则启
        docs_port="$(service_port docs 4181)"
        if is_running "$docs_port" docs; then stop_service docs; else start_service docs 4181; fi
        ;;
      start)   start_service docs 4181 ;;
      stop)    stop_service docs ;;
      build)   ensure_toolchain && pnpm docs:build ;;
      status)  show_status ;;
      logs)    show_logs docs ;;
      *) say "用法: ./Mochi.command docs [start|stop|build|status|logs]"; exit 2 ;;
    esac
    finish
    ;;
  toggle|'')
    # 双击语义：优先文档站（完整组件演示，与文档页一致），其次 playground 开发沙盒
    docs_port="$(service_port docs 4181)"
    pg_port="$(service_port playground 5173)"
    if is_running "$docs_port" docs; then
      stop_service docs; finish
    elif is_running "$pg_port" playground; then
      stop_service playground; finish
    else
      start_service docs 4181; finish
    fi
    ;;
  *)
    say "用法: ./Mochi.command [start|stop|restart|status|logs|docs]"
    exit 2
    ;;
esac
