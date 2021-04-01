//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
const BASE_URL = process.env.VUE_APP_API_BASE_URL
module.exports = {
  EMAIL_LOGIN: `${BASE_URL}/api/users/login/email`,
  ATTACHMENTS: `${BASE_URL}/api/admin/attachments`,
  DEPARTMENTS: `${BASE_URL}/api/admin/departments`,
  USERS: `${BASE_URL}/api/admin/users`,
  UPLOAD: `${BASE_URL}/api/admin/attachments/upload`,
  UPLOADS: `${BASE_URL}/api/admin/attachments/uploads`,
  ARTICLE: `${BASE_URL}/api/admin/articles`
}
