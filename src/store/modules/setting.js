const state = {
  curRouteCase: localStorage.getItem('curRouteCase') || '/testcase/layer23',
  curRouteResouce: localStorage.getItem('curRouteResouce') || '/resource/portCfg',
  curRouteSetting: localStorage.getItem('curRouteSetting') || '/setting/log',
}

const mutations = {
  set_case_route: (state, route) => {
    localStorage.setItem('curRouteCase', route)
    state.curRouteCase = route
  },
  set_resource_route: (state, route) => {
    localStorage.setItem('curRouteResouce', route)
    state.curRouteResouce = route
  },
  set_setting_route: (state, route) => {
    localStorage.setItem('curRouteSetting', route)
    state.curRouteSetting = route
  },
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
