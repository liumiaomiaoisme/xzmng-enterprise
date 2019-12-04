export function formatTime (data) {
  let newTime = data ? new Date(data) : new Date()
  let y = newTime.getFullYear()
  let mo = (newTime.getMonth() + 1).toString().padStart(2, '0')
  let d = newTime.getDate().toString().padStart(2, '0')
  let h = newTime.getHours().toString().padStart(2, '0')
  let mi = newTime.getMinutes().toString().padStart(2, '0')
  let s = newTime.getSeconds().toString().padStart(2, '0')
  if (data) {
    return `${y}-${mo}-${d} ${h}:${mi}:${s}`
  } else {
    return `${y}-${mo}-${d} ${h}:${mi}:00`
  }
}
export default {
  formatTime
}
