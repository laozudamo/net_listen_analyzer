import { login, getInfo, logout } from '@/api/setting/user'
import router, { resetRouter } from '@/router'

const state = {
    username: '',
    description: '',
    id: '',
    // 0: "admin" 1: 普通用户
    role: [],
    token: window.localStorage.getItem('token') || '',

    // 控制左侧菜单折叠
    // collapsed:false
}

const mutations = {
    set_name(state, username) {
        state.username = username
    },
    set_description(state, description) {
        state.description = description
    },
    set_user_id(state, id) {
        state.id = id
    },
    set_role(state, role) {
        state.role = role
    },
    set_token(state, token) {
        state.token = token
    },
    // set_collapsed(state,payload){
    //     state.collapsed = payload
    // }
}

const actions = {
    LOGIN({ commit, dispatch, state }, data) {
        console.log('登录')
        return new Promise((resolve, reject) => {
            login(data).then((res) => {
                const { token } = res.data
                if (token) {
                    window.localStorage.setItem('token', token)
                    commit('set_token', token)
                }
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    },

    LOGOUT({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout().then(res => {
                commit('set_role', [])
                commit('set_token', '')
                localStorage.removeItem('token')
            })
            resetRouter()
            resolve()
        })
    },

    // remove token
    REST_TOKEN({ commit }) {
        return new Promise(resolve => {
            commit('set_token', '')
            commit('set_role', [])
            localStorage.removeItem('token')
            resolve()
        })
    },

    GET_USER_INFO({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo().then(response => {
                const { data } = response
                if (!data) {
                    reject('校验失败, 请重新登录 !')
                }
                const { role, username, description, id } = data
                if (!role || role.length <= 0) {
                    reject('用户角色不能为空')
                }
                commit('set_name', username)
                commit('set_description', description)
                commit('set_user_id', id)
                commit('set_role', role[0])
                resolve(role)
            })
        })
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}