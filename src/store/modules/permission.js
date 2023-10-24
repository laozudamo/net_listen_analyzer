import { asyncRoutes, constantRoutes } from '@/router'

function hasPermission(role, route) {
    if (route.meta && route.meta.role) {
        return role.some(v => route.meta.role.includes(v))
    } else {
        return true
    }
}

export function filterAsyncRoutes(routes, role) {
    const res = []
    routes.forEach(route => {
        const tmp = {...route }
        if (hasPermission(role, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, role)
            }
            res.push(tmp)
        }
    })
    return res
}

const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    set_routes: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    },
    // 遍历菜单后添加至仓库
    add_routes: (state, payload) => {
        state.routes = payload
    }
}

const actions = {
    generateRoutes({ commit }, role) {
        return new Promise(resolve => {
            let accessedRoutes
            if (role.includes('0')) {
                accessedRoutes = asyncRoutes || []
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, role)
            }
            commit('set_routes', accessedRoutes)
            resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}