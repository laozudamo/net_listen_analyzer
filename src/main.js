// js
import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router/index.js'
import { setupStore } from './store/index.js'
import components from './components/index.js'
import { registerDirective } from './directives/index.js'
import Toaster from "@meforma/vue-toaster";
// css
import 'normalize.css/normalize.css'

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

import './styles/index.scss'
import naive from 'naive-ui'
import './permission.js'
import eventBus from 'vue3-eventbus'

import 'virtual:svg-icons-register' // vite-plugin-svg-icons

function setupApp() {
    const app = createApp(App)
    setupRouter(app)
    setupStore(app)
    registerDirective(app)
    app.use(eventBus)
    app.use(naive)
    app.use(components)
    app.use(Toaster)
    app.use(VXETable)
    app.mount('#app')
}
setupApp()