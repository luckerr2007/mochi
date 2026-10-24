/**
 * 把令牌样式表复制进 dist。
 *
 * 令牌不通过 JS 自动注入（见 src/index.ts 的说明），因此需要以静态文件形式随包发布，
 * 使用者从 `mochi-island-ui/styles/tokens.css` 显式引入。
 */
import { cp, mkdir } from 'node:fs/promises';

const dist = new URL('../dist/styles/', import.meta.url);

await mkdir(dist, { recursive: true });
await cp(new URL('../src/styles/tokens.css', import.meta.url), new URL('tokens.css', dist));
