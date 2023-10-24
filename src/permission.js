import router from './router'
import store from './store'

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {

    const hasToken = localStorage.getItem('token')

    if (hasToken) {
        if (to.path === '/login') {
            next()
        } else {
            const hasRoles = store.getters.role && store.getters.role.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    const role = await store.dispatch('user/GET_USER_INFO')
                    const accessRoutes = await store.dispatch('permission/generateRoutes', role)
                    accessRoutes.forEach((route) => {
                        router.addRoute(route);
                    });
                    if (to.redirectedFrom) {
                        router.replace(to.redirectedFrom);
                    } else {
                        next({ ...to, replace: true });
                    }
                } catch (error) {
                    console.log('error', error)
                    next(`/login?redirect=${to.path}`)
                }
            }
        }
    } else {
        if (whiteList.includes(to.path)) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})