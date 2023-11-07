// 进行全局指令封装
// import store from '@/store'
import { nextTick } from 'vue'

export function setPermission (app) {
    app.directive('permission', {
        mounted (el, binding, vnode) {
            console.log(binding.value, '这是权限指令的参数')
            let role = ['0']
            let isShow = role.some(item => binding.value.includes(item))
            console.log(isShow, '这是权限指令的结果')
            if (!isShow) {
                el.parentNode.removeChild(el)
            }
        }
    })
}
// 加强截流函数
export function throttle (fn, wait) {
    let previous = 0
    let timer = null
    return function () {
        let now = Date.now()
        if (now - previous < wait) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                previous = now
                fn.apply(this, args)
            }, wait)
        } else {
            previous = now
            fn.apply(this.arguments)
        }
    }
}

export function debounce (func, wait = 500, flag = true) {
    let timer, args, that;
    return function (args) {
        args = arguments;
        that = this;
        let callnow = flag && !timer;
        if (callnow) func.apply(that, args); //不传入参数flag这段行代码不执行
        clearTimeout(timer);
        timer = setTimeout(function () {
            timer = null;
            if (!flag) func.apply(that, args);
        }, wait);
    };
}

function setDebounce (app) {
    app.directive('debounce', {
        mounted (el, binding, vnode) {
            let {
                fn,
                wait = 300,
                flag = true,
                type = 'click'
            } = binding.value

            el.addEventListener(type, debounce(fn, wait, flag))
        },
        beforeUnmount (el, binding) {
            // let {
            //     fn,
            //     wait = 300,
            //     flag = true,
            //     type = 'click'
            // } = binding.value
            // el.removeEventListener(flag)
            // console.log('移除事件监听器')
        }
    })
}

// const dialogDrag = (app, options) => {
//     app.directive('drag', {
//         // 指令的定义

//         mounted (el, binding, vnode) {
//             // console.log('binding', binding)
//             // binding.arg
//             // binding.value
//             // 可视窗口的宽度
//             const clientWidth = document.documentElement.clientWidth
//             // 可视窗口的高度
//             const clientHeight = document.documentElement.clientHeight

//             // 弹窗的容器
//             // console.log(el,vnode.el, binding.instance)
//             // 拖拽的div
//             const domMove = el
//             console.log(domMove)
//             return

//             // 记录坐标
//             // console.log('el', el)
//             // 计算分数
//             let tmpWidth = binding.value.replace('%', '') //
//             tmpWidth = clientWidth * (100 - tmpWidth) / 200

//             const domset = {
//                 x: tmpWidth,
//                 y: clientHeight * 15 / 100 // 根据 15vh 计算
//             }

//             // 重新设置上、左距离
//             domDrag.style.marginTop = domset.y + 'px'
//             domDrag.style.marginLeft = domset.x + 'px'

//             // 记录拖拽开始的光标坐标，0 表示没有拖拽
//             const start = { x: 0, y: 0 }
//             // 移动中记录偏移量
//             const move = { x: 0, y: 0 }

//             // 经过时改变鼠标指针形状
//             domMove.onmouseover = (e) => {
//                 domMove.style.cursor = 'move' // 改变光标形状
//             }

//             // 鼠标按下，开始拖拽
//             domMove.onmousedown = (e) => {
//                 // 判断对话框是否重新打开
//                 if (domDrag.style.marginTop === '15vh') {
//                     // 重新打开，设置 domset.y  top
//                     domset.y = clientHeight * 15 / 100
//                 }
//                 start.x = e.clientX
//                 start.y = e.clientY
//                 domMove.style.cursor = 'move' // 改变光标形状
//             }

//             // 鼠标移动，实时跟踪 domMove
//             domMove.onmousemove = (e) => {
//                 if (start.x === 0) { // 不是拖拽状态
//                     return
//                 }
//                 move.x = e.clientX - start.x
//                 move.y = e.clientY - start.y

//                 // console.log('鼠标over', start, end)
//                 // 初始位置 + 拖拽距离
//                 domDrag.style.marginLeft = (domset.x + move.x) + 'px'
//                 domDrag.style.marginTop = (domset.y + move.y) + 'px'
//             }
//             // 鼠标抬起，结束拖拽 domMove
//             domMove.onmouseup = (e) => {
//                 move.x = e.clientX - start.x
//                 move.y = e.clientY - start.y

//                 // 记录新坐标，作为下次拖拽的初始位置
//                 domset.x += move.x
//                 domset.y += move.y
//                 domMove.style.cursor = ''
//                 domDrag.style.marginLeft = domset.x + 'px'
//                 domDrag.style.marginTop = domset.y + 'px'
//                 // 结束拖拽
//                 start.x = 0

//                 // window.document.onmousemove = null
//                 // window.document.onmouseup = null
//             }
//         }
//     })
// }

export function registerDirective (app) {
    setDebounce(app)
    setPermission(app)
    // dialogDrag(app)
}