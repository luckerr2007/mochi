# 发布流程

发布**不自动化**。CI 只做校验，`npm publish` 由维护者在本机确认后手动执行。

## 1. 发布前检查

```bash
pnpm install --frozen-lockfile
pnpm test          # 41 个用例：令牌契约、对比度、组件行为、resolver
pnpm typecheck     # 三个包
pnpm build         # 产出 packages/mochi-island-ui/dist
pnpm docs:build    # 文档站能构建（顺带验证 dist 可用）
```

全绿再进行下一步。

## 2. 检查将要发布的文件

```bash
pnpm pack:check
```

等价于 `npm pack --dry-run`。应该只看到 `dist/**`、`package.json`、`README.md`、`LICENSE`，
不应出现 `src/`、`tsconfig.json`、测试文件。预期清单：

```
dist/index.js  dist/index.d.ts
dist/resolver.js  dist/resolver.d.ts
dist/tokens.js  dist/tokens.d.ts
dist/style.css
dist/styles/tokens.css
dist/components/{button,bubble,panel,input,switch,checkbox,tag}/…
```

## 3. 版本号

遵循 SemVer。当前处于 `0.x`，任何破坏性改动都可以只递次版本号，
但请在同一次提交里写清 `CHANGELOG` 条目（若尚未建立，至少写进 commit message）。

```bash
pnpm --filter mochi-island-ui exec npm version patch   # 或 minor / major
```

## 4. 发布

```bash
# 先干跑一次，确认 registry 与权限
pnpm --filter mochi-island-ui exec npm publish --dry-run

# 确认无误后再真发
pnpm --filter mochi-island-ui exec npm publish
```

`prepublishOnly` 会自动跑一遍 `build + test`，因此即使跳过第 1 步也不会发未构建的包。

## 5. 发布后

- 打 tag：`git tag mochi-island-ui@0.1.0 && git push --tags`
- 文档站部署（任意静态托管，产物在 `docs/.vitepress/dist`）

## 待补

- `packages/mochi-island-ui/package.json` 尚未填 `repository` / `homepage` / `bugs`——
  仓库地址确定后补上，npm 页面会好看很多。
- 包名 `mochi-island-ui` 未做可用性核查，首次发布前先 `npm view mochi-island-ui` 确认没被占用；
  若已被占用，改成带 scope 的形式（如 `@your-scope/mochi-island-ui`）并同步更新
  `mochiUiResolver` 里的 `from` 前缀。
