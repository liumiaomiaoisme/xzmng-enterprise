// export一个函数和export一个对象是有区别的，this的指向是不同的。导致调用时也会有所不同，注意这个问题
// lastTime = 0 的初始值写在组件内的data中，这样就不会被清除或每次被重新赋值
// 调用时需要用apply，指定到组件的this上，不然还是会变成函数的this
export function throttle (fn, delay = 1000) {
  let nowTime = Date.now()
  if (nowTime - this.lastTime > delay) {
    fn()
    this.lastTime = Date.now()
  }
}

// timer = null  定时器不能是这个函数私有的，要放在data中
// export function debounce (fn, delay = 1000) {
//   let _this = this
//   return function (...args) {
//     if (_this.timer) {
//       clearTimeout(_this.timer)
//     }
//     _this.timer = setTimeout(() => {
//       fn.apply(_this, args)
//     }, delay)
//   }
// }

export default {
  throttle
}
