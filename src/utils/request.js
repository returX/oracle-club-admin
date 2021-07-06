import axios from 'axios'

// 跨域认证信息 header 名
export const xsrfHeaderName = 'Authorization'

axios.defaults.timeout = 5000
axios.defaults.withCredentials = true
axios.defaults.xsrfHeaderName= xsrfHeaderName
axios.defaults.xsrfCookieName= xsrfHeaderName

// 认证类型
const AUTH_TYPE = {
  BEARER: 'Bearer',
  BASIC: 'basic',
}

// http method
const METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
}

const http = axios.create({
  timeout: 10000,
  baseURL: process.env.VUE_APP_API_BASE_URL,
})

/**
 * 设置认证信息
 * @param auth {Object}
 * @param authType {AUTH_TYPE} 认证类型，默认：{AUTH_TYPE.BEARER}
 */
function setAuthorization(auth, authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      localStorage.setItem("refresh_token",auth.refreshToken)
      localStorage.setItem(xsrfHeaderName,'Bearer ' + auth.token)
      break
    case AUTH_TYPE.BASIC:
    default:
      break
  }
}

/**
 * 移出认证信息
 * @param authType {AUTH_TYPE} 认证类型
 */
function removeAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      localStorage.removeItem(xsrfHeaderName)
      localStorage.removeItem("refresh_token")
      break
    case AUTH_TYPE.BASIC:
    default:
      break
  }
}

/**
 * 检查认证信息
 * @param authType
 * @returns {boolean}
 */
function checkAuthorization(authType = AUTH_TYPE.BEARER) {
  switch (authType) {
    case AUTH_TYPE.BEARER:
      if (localStorage.getItem(xsrfHeaderName)) {
        return true
      }
      break
    case AUTH_TYPE.BASIC:
    default:
      break
  }
  return false
}

/**
 * 加载 axios 拦截器
 * @param interceptors
 * @param options
 */
function loadInterceptors(interceptors, options) {
  const {request, response} = interceptors
  // 加载请求拦截器
  request.forEach(item => {
    let {onFulfilled, onRejected} = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = config => config
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    http.interceptors.request.use(
      config => onFulfilled(config, options),
      error => onRejected(error, options)
    )
  })
  // 加载响应拦截器
  response.forEach(item => {
    let {onFulfilled, onRejected} = item
    if (!onFulfilled || typeof onFulfilled !== 'function') {
      onFulfilled = response => response
    }
    if (!onRejected || typeof onRejected !== 'function') {
      onRejected = error => Promise.reject(error)
    }
    http.interceptors.response.use(
      response => onFulfilled(response, options),
      error => onRejected(error, options)
    )
  })
}

/**
 * 解析 url 中的参数
 * @param url
 * @returns {Object}
 */
function parseUrlParams(url) {
  const params = {}
  if (!url || url === '' || typeof url !== 'string') {
    return params
  }
  const paramsStr = url.split('?')[1]
  if (!paramsStr) {
    return params
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1]
    params[paramsArr[i * 2]] = value === 'true' ? true : (value === 'false' ? false : value)
  }
  return params
}

export {
  METHOD,
  AUTH_TYPE,
  http as request,
  setAuthorization,
  removeAuthorization,
  checkAuthorization,
  loadInterceptors,
  parseUrlParams
}
