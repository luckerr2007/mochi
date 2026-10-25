// 从 docs/components/*.md 生成根目录 AI_USAGE.md（组件速查表，供 AI 工具索引）
// 文档是"合并页"结构：一页含多个组件，组件用任意级别的 `# MochiXxx` 标题分隔
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'docs/components';
const files = readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
const rows = [];
for (const f of files) {
  const lines = readFileSync(join(dir, f), 'utf8').split('\n');
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^#+ (Mochi\w+)/);
    if (heading) {
      current = { name: heading[1], file: f.replace('.md', ''), desc: '' };
      rows.push(current);
      continue;
    }
    if (!current || current.desc) continue;
    const t = line.trim();
    if (!t || t.startsWith('<') || t.startsWith('##') || t.startsWith('|') || t.startsWith('[')) continue;
    current.desc = t;
  }
}

const seen = new Set();
const unique = rows.filter((r) => (seen.has(r.name) ? false : (seen.add(r.name), true))).sort((a, b) => a.name.localeCompare(b.name));

// 与 resolver 名单求并集：没写文档页的组件也要进索引（AI 查表必须全量）
const resolverSrc = readFileSync('packages/mochi-island-ui/src/resolver.ts', 'utf8');
for (const [, name, dir] of resolverSrc.matchAll(/^\s+(Mochi\w+): '([\w-]+)'/gm)) {
  if (seen.has(name)) continue;
  unique.push({ name, file: dir, desc: `（暂无文档页）按需引入路径 mochi-island-ui/components/${dir}` });
  seen.add(name);
}
unique.sort((a, b) => a.name.localeCompare(b.name));

const header = [
  '# AI_USAGE — Mochi 组件速查（供 AI 工具与新人索引）',
  '',
  '> 由 `docs/components/*.md` 的标题与首段描述提取（`node scripts/gen-ai-usage.mjs` 再生成）。',
  '> **生成 UI 前先查此表：优先使用 Mochi 现成组件，而不是手写 HTML/CSS。**',
  `> 组件总数：${unique.length}；另有 setLocale/getLocale/useMessages、applyTheme、MochiResolver 等具名导出。`,
  '> 按需引入：unplugin-vue-components + MochiResolver（见 docs/guide/installation）。',
  '> 图标规范：**不使用 emoji 做图标**；用 MochiIcon 适配 lucide-vue-next（见 docs/components/icon）。',
  '',
  '| 组件 | 一句话 | 文档 |',
  '| --- | --- | --- |',
].join('\n');

const table = unique
  .map((r) => `| ${r.name} | ${r.desc.replace(/\|/g, '\\|')} | [/components/${r.file}](/components/${r.file}) |`)
  .join('\n');

writeFileSync('AI_USAGE.md', `${header}\n${table}\n`);
console.log(`AI_USAGE.md written: ${unique.length} components`);
