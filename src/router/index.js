import { createRouter, createWebHashHistory } from 'vue-router'
export const constantRoutes = [{
    path: '',
    component: () => import('@/layout/index.vue'),
    hidden: true,
    redirect: '/pcap',
    children: [
        // {
        //     path: '/serve',
        //     name: 'serve',
        //     component: () => import('@/views/serve/index.vue')
        // },
        // {
        //     path: "/testcase",
        //     name: 'testcase',
        //     component: () => import('@/views/testCase/index.vue'),
        //     children: [
        //         {
        //             path: 'layer23',
        //             name: 'layer23',
        //             children: [
        //                 {
        //                     path: '',
        //                     name: '',
        //                     component: () => import('@/views/testCase/layer23/index.vue')
        //                 },
        //                 {
        //                     path: 'flow',
        //                     name: 'flow',
        //                     component: () => import('@/views/testCase/layer23/flow.vue')
        //                 },
        //             ]
        //         },
        //         {
        //             path: 'tcp',
        //             name: 'tcp',
        //             component: () => import('@/views/testCase/tcp/index.vue')
        //         },
        //         {
        //             path: 'igmpv1',
        //             name: 'igmpv1',
        //             component: () => import('@/views/testCase/igmp/igmpv1.vue')
        //         },
        //         {
        //             path: 'igmpv2',
        //             name: 'igmpv2',
        //             component: () => import('@/views/testCase/igmp/igmpv2.vue')
        //         },
        //         {
        //             path: 'igmpv3',
        //             name: 'igmpv3',
        //             component: () => import('@/views/testCase/igmp/igmpv3.vue')
        //         },
        //         {
        //             path: 'icmp',
        //             name: 'icmp',
        //             component: () => import('@/views/testCase/icmp/index.vue')
        //         },
        //         {
        //             path: 'ipv4',
        //             name: 'ipv4',
        //             component: () => import('@/views/testCase/ipv4/index.vue')
        //         },
        //         {
        //             path: 'ipv6',
        //             name: 'ipv6',
        //             component: () => import('@/views/testCase/ipv6/index.vue')
        //         },
        //         {
        //             path: 'udp',
        //             name: 'udp',
        //             component: () => import('@/views/testCase/udp/index.vue')
        //         },

        //         {
        //             path: 'arp',
        //             name: 'arp',
        //             component: () => import('@/views/testCase/arp/index.vue')
        //         },
        //         {
        //             path: 'playBack',
        //             name: 'playBack',
        //             component: () => import('@/views/testCase/playBack/index.vue')
        //         },
        //         {
        //             path: 'rfcCreat',
        //             name: 'rfcCreat',
        //             component: () => import('@/views/testCase/rfc2544/rfcCreat.vue')
        //         },
        //         {
        //             path: 'rfcDelay',
        //             name: 'rfcDelay',
        //             component: () => import('@/views/testCase/rfc2544/rfcDelay.vue')
        //         },
        //         {
        //             path: 'rfcThroughput',
        //             name: 'rfcThroughput',
        //             component: () => import('@/views/testCase/rfc2544/rfcThroughput.vue')
        //         },
        //         {
        //             path: 'rfcBack',
        //             name: 'rfcBack',
        //             component: () => import('@/views/testCase/rfc2544/rfcBack.vue')
        //         },
        //         {
        //             path: 'rdma',
        //             name: 'rdma',
        //             component: () => import('@/views/testCase/rdma/index.vue')
        //         },

        //     ]
        // },
        // {
        //     path: "/task",
        //     name: 'task',
        //     component: () => import('@/views/task/index.vue')
        // },
        // {
        //     path: "/monitor",
        //     name: 'monitor',
        //     component: () => import('@/views/monitor/index.vue')
        // },
        // {
        //     path: "/report",
        //     name: 'report',
        //     component: () => import('@/views/report/index.vue')
        // },
        // {
        //     path: "/capture",
        //     name: 'capture',
        //     component: () => import('@/views/capture/index.vue')
        // },
        {
            path: "/setting",
            name: 'setting',
            component: () => import('@/views/setting/index.vue'),
            children: [
                {
                    path: "log",
                    name: 'log',
                    component: () => import('@/views/setting/system/Log.vue')
                },
                {
                    path: "systeminfo",
                    name: 'systeminfo',
                    component: () => import('@/views/setting/system/SystemInfo.vue')
                },
                {
                    path: "portinfo",
                    name: 'portinfo',
                    component: () => import('@/views/setting/system/PortManage.vue')
                },
                {
                    path: "useradmin",
                    name: 'useradmin',
                    component: () => import('@/views/setting/userAdmin/index.vue')
                },
                {
                    path: "reportconfig",
                    name: 'reportconfig',
                    component: () => import('@/views/setting/reportConfig/index.vue')
                },
                // {
                //     path: "sets",
                //     name: 'sets',
                //     component: () => import('@/views/setting/index.vue')
                // },
                // {
                //     path: "netCard",
                //     name: 'netCard',
                //     component: () => import('@/views/setting/netCard/index.vue')
                // },
                {
                    path: "license",
                    name: 'license',
                    component: () => import('@/views/setting/license/index.vue')
                },
            ]
        },
        {
            path: "/resource",
            name: 'resource',
            component: () => import('@/views/resource/index.vue'),
            children: [
                {
                    path: "portCfg",
                    name: 'portCfg',
                    component: () => import('@/views/resource/portCfg/index.vue')
                },

            ]
        },
        {
            path: '/pcap',
            name: 'pcap',
            component: () => import('@/views/pcap/index.vue')
        },
    ]
},
{
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () =>
        import('@/views/login/index.vue')
},
{
    path: '/403',
    name: '403',
    hidden: true,
    component: () =>
        import('@/views/error/403.vue'),
},
{
    path: '/404',
    name: '404',
    hidden: true,
    component: () =>
        import('@/views/error/404.vue'),
},
{
    path: "/:pathMath(.*)", // 此处需特别注意置于最底部
    redirect: "/404"
}
]

export const asyncRoutes = [{
    path: '',
    component: () =>
        import('../layout/index.vue'),
    hidden: true,
    children: [{
        path: '/setting/userAdmin',
        name: 'userAdmin',
        component: () =>
            import('@/views/setting/userAdmin/index.vue'),
    },]
},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: constantRoutes
})

export function setupRouter (app) {
    app.use(router)
}

export function resetRouter () {
    const newRouter = createRouter({
        history: createWebHashHistory(),
        routes: constantRoutes
    })
    router.matcher = newRouter.matcher // reset router
}


export default router