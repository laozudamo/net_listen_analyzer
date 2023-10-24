const gettersModules = import.meta.glob('./getters/*.js', { eager: true })
let getters = {}

// 处理gettersModules
// for (const path in gettersModules) {
//   await gettersModules[path]().then((mod) => {
//     getters = { ...mod.default, ...getters }
//   })
// }

for (const path in gettersModules) {
  getters = { ...gettersModules[path].default, ...getters }
}

export default getters