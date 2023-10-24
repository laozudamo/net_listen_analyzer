
let socket = ''
let url = `ws://${import.meta.env.VITE_BASE_API}/realtime/realtime`

function init () {
  console.log('initt...')
  if (!window.WebSocket) {
    ElMessage.error({
      message: "您的浏览器不支持websocket,请升级或更换浏览器！",
      type: "error",
      center: true,
    });
    return;
  }

  if (!socket) {
    socket = new WebSocket(url)
    socketOnOpen()
  }
}

function socketOnOpen () {
  socket.onopen = () => {
    let token = localStorage.getItem('token')
    console.log(token)
    socketOnSend(token)
    socketOnSend({ "task_switch": "task_on" })
  };
}

function socketOnClose () {
  socketOnSend({ "task_switch": "task_off" })
  socket.close()
}

//数据发送
function socketOnSend (data) {
  socket.send(JSON.stringify(data));
}


function socketOnMessage (fn) {
  socket.onmessage = (e) => {
    fn(JSON.parse(e.data))
  };
}

function destory () {
  socketOnSend({ "task_switch": "task_off" })
  socket.close()
  socket.onclose = function(e) {
    console.log(e)
    socket = ''
  }
}
export {
  init,
  socketOnMessage,
  destory
}