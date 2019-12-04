export function debounce (fn, delay = 1000) {
  let timer = null
  return function () {
    let args = arguments
    let that = this
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(that, args)
    }, delay)
  }
}
export function throttle (fn, delay = 1000) {
  let lastTime = 0
  return function () {
    let args = arguments
    let that = this
    let nowTime = Date.now()
    if (nowTime - lastTime > delay) {
      fn.apply(that, args)
      lastTime = nowTime
    }
  }
}

export function dateKeyClear (formName, mDate, sDateStart, sDateEnd) {
  if (formName[mDate]) {
    formName[sDateStart] = formName[mDate][0]
    formName[sDateEnd] = formName[mDate][1]
    delete formName[mDate]
  }
}

export function clearEmptyKey (formName) {
  for (let key in formName) {
    if (formName[key] === '') {
      delete formName[key]
    }
    if (formName[key] === null) {
      delete formName[key]
    }
  }
}
