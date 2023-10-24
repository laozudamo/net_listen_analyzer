import { createStore } from 'vuex'
import getters from './getters.js'
// 导入所有modules下面的JS文件
const modulesFiles = import.meta.globEager('./modules/*.js')

/* 
  如果某些文件被率先应用 使用globEager
*/
const modules = {}
for (const path in modulesFiles) {
    let moduleName = path.replace(/^\.\/.*\/(.*)\.\w+$/, '$1')
    modules[moduleName] = modulesFiles[path].default
}

const store = createStore({
  modules,
  getters
})

export default store

export function setupStore(app) {
  app.use(store)
}

