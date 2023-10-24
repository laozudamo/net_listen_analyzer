import { defineAsyncComponent } from 'vue';
const components = import.meta.glob('../components/*.vue');

// 全局组件的自动注册插件
export default {
  install(app) {
    for (const [key, component] of Object.entries(components)) {
      let name = key.split('/').pop().replace('.vue', '')
      app.component(name, defineAsyncComponent(component));
    }
  }
}
