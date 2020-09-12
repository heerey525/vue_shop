// 用localstorage存数据
export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}
// 取localstorage的数据
export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}
