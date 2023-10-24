export function debounce(func, wait = 500, flag = true) {
  let timer, args, that; 
  return function (args) {
  //args包含了func的事件对象,that为func的this指向(应当指向事件源)
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
        fn.apply(this, arguments)
      }, wait)
    } else {
      previous = now
      fn.apply(this, arguments)
    }
  }
}


