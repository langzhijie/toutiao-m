// 此文件是用来分发token令牌 读写删除

const USER_TOKEN = 'toubiao-m' // 用来存储用户信息

// 设置用户的token信息
export function setUser (user) {
  // 存入本地 (名字,转化字符串后的对象)
  window.localStorage.setItem(USER_TOKEN, JSON.stringify(user))
}

// 获取用户的token信息
export function getUser () {
  // 判断字符串是不是空的 要是空的返回空对象
  // 先将字符串转化成对象再返回
//   window.localStorage.getItem(USER_TOKEN) true 就不执行 false的话就是空的就返回空对象
  return JSON.parse(window.localStorage.getItem(USER_TOKEN) || '{}') // 短路表达式
  // return JSON.parse(window.localStorage.getItem(USER_TOKEN) ? window.localStorage.getItem(USER_TOKEN) : '{}') //三元表达式形式
}

// 删除用户的token信息
export function delUser () {
  localStorage.removeItem(USER_TOKEN)
}
