import {METHOD, removeAuthorization, request, xsrfHeaderName} from "@/utils/request";
import {REFRESH_TOKEN} from "@/services/api";



// 是否正在刷新的标记
let isRefreshing = false

let retryRequests = [];
function onAccessTokenFetched() {
  retryRequests.forEach((callback)=>{
    callback();
  })
  retryRequests = [];
}

function addRequestQueue(callback) {
  retryRequests.push(callback)
}


// 401拦截
const resp401 = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @param options 应用配置 包含: {router, store, message}
   * @returns {*}
   */
  onFulfilled(response, options) {
    const {message} = options
    if (response.code === 401) {
      message.error('无此权限')
    }
    return response
  },
  /**
   * 响应出错时执行
   * @param error 错误对象
   * @param options 应用配置 包含: {router, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message,router} = options
    const {response,config} = error
    console.log(config)
    if (response.status === 401) {
      const {result} = response.data
      //refreshToken过期
      if (result === "refreshToken failed"){
        message.warn('登录已失效，请重新登录')
        removeAuthorization()
        router.push("/login")
        return Promise.reject(error)
      }
      //阻塞批量请求，直到新的token更新
      if (!isRefreshing){
        isRefreshing = true
        request({
          url: REFRESH_TOKEN,
          method: METHOD.POST,
          params: {refresh_token: localStorage.getItem("refresh_token")}
        }).then(resp=>{
          if (resp.data.result === "ok"){
            localStorage.setItem(xsrfHeaderName,'Bearer ' + resp.data.data.newToken)
          }
          isRefreshing = false
          //执行队列中缓存的请求
          onAccessTokenFetched()
        })
      }
      //缓存请求
      return new Promise((resolve => {
        addRequestQueue(()=>{
            resolve(request(config))
          })
      }))
      //todo 服务器返回401响应码之后，浏览器刷新token并重新请求(? 可能拿回的数据也没用) 拦截router？
    }
    return Promise.reject(error)
  }
}

const resp403 = {
  onFulfilled(response, options) {
    const {message} = options
    if (response.code === 403) {
      message.error('请求被拒绝')
    }
    return response
  },
  onRejected(error, options) {
    const {message} = options
    const {response} = error
    if (response.status === 403) {
      message.error('请求被拒绝')
    }
    return Promise.reject(error)
  }
}

// const respCommon = {
//   /**
//    * 响应成功
//    * @param response 响应对象
//    * @param options 应用配置 包含: {router, store, message}
//    * @returns {*}
//    */
//   onFulfilled(response, options) {
//     return response
//   },
//   /**
//    * 响应出错时执行
//    * @param error 错误对象
//    * @param options 应用配置 包含: {router, store, message}
//    * @returns {Promise<never>}
//    */
//   onRejected(error, options) {
//     const {message} = options
//     const {response} = error
//     if (!response){
//       message.warn("")
//     }
//     return Promise.reject(error)
//   }
// }

const reqCommon = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options 应用配置 包含: {router, store, message}
   * @returns {*}
   */
  onFulfilled(config, options) {
    const {message} = options
    const {url, xsrfHeaderName} = config

    if (url.indexOf('login') === -1 && xsrfHeaderName && !localStorage.getItem(xsrfHeaderName)) {
      message.warning('认证 token 已过期，请重新登录')
    }
    if (localStorage.getItem(xsrfHeaderName)){
      config.headers.Authorization = localStorage.getItem(xsrfHeaderName)
    }
    return config
  },
  /**
   * 请求出错时做点什么
   * @param error 错误对象
   * @param options 应用配置 包含: {router, store, message}
   * @returns {Promise<never>}
   */
  onRejected(error, options) {
    const {message} = options
    console.log(error)
    message.error(error.message)
    return Promise.reject(error)
  }
}

export default {
  request: [reqCommon], // 请求拦截
  response: [resp401, resp403] // 响应拦截
}
