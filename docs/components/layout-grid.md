# MochiLayout

页面骨架：默认纵向（Header/Content/Footer），`hasSider` 切横排容纳侧栏。骨架本身不带视觉，边框与底色在各区自己身上。

```vue
<MochiLayout has-sider>
  <MochiLayoutHeader>岛屿档案馆</MochiLayoutHeader>
  <MochiLayoutSider collapsible v-model:collapsed="off">菜单</MochiLayoutSider>
  <MochiLayoutContent>正文</MochiLayoutContent>
  <MochiLayoutFooter>© 2026 Mochi</MochiLayoutFooter>
</MochiLayout>
```

## 各区

- **Header**：默认 `sticky` 吸顶（可 `:sticky="false"` 关）。
- **Sider**：`width` 默认 208px；`collapsible` 后右缘出折叠钮，`v-model:collapsed` 受控，收起动画走弹簧令牌。
- **Content**：`flex:1` + `min-width:0`，内部放宽表格也不会撑破骨架。
- **Footer**：弱化文字色的收尾条。

# MochiGrid

12 列（可调）等宽栅格，`gap` 单位 px，子项用 MochiGridItem 控制 `span`；`sm`/`md`/`lg` 是从 640/768/1024px 起生效的覆盖档位，不传沿用更小档。

```vue
<MochiGrid :cols="12" :gap="16">
  <MochiGridItem :span="12" :sm="6" :md="4">卡片</MochiGridItem>
  <MochiGridItem :span="12" :sm="6" :md="4">卡片</MochiGridItem>
  <MochiGridItem :span="12" :md="4">卡片</MochiGridItem>
</MochiGrid>
```

栅格是纯布局组件：不给子项任何视觉，卡片感交给内容自己（比如套 MochiPanel）。
