import {COMMON_USERS, USERS} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'


const userApi = {}

userApi.loginEmail = (username, password) => {
  return request({
    url:`${COMMON_USERS}/login/email`,
    method:METHOD.POST,
    data:{
      username: username,
      password: password
    }
  })
}

userApi.loginVerify= (email, verifyCode) => {
  return request({
    url:`${COMMON_USERS}/login/verify`,
    method:METHOD.POST,
    data:{
      email: email,
      verifyCode: verifyCode
    }
  })
}

userApi.getVerifyCode = (email) => {
  return request({
    url:`${COMMON_USERS}/verifyCode`,
    method:METHOD.POST,
    params: {email}
  })
}

userApi.logout = () => {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}

userApi.list = (params) => {
  return request({
    url: USERS,
    method: METHOD.GET,
    params:params,
  })
}

userApi.deleteMulti = ids =>{
  return request({
    url: USERS,
    method: METHOD.DELETE,
    data: ids
  })
}

userApi.update = (record) =>{
  return request({
    url: `${USERS}/${record.id}`,
    method: METHOD.PUT,
    data:record,
  })
}

userApi.delete = (id) =>{
  return request({
    url: `${USERS}/${id}`,
    method: METHOD.DELETE,
  })
}

export default userApi
