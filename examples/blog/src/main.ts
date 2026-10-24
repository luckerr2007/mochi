import { createApp } from 'vue';
// 主题是显式资源：先令牌；组件样式随 SFC 一并编译（alias 直连源码）
import 'mochi-island-ui/styles/tokens.css';
import App from './App.vue';

createApp(App).mount('#app');
