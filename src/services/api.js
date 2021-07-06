//跨域代理前缀
// const API_PROXY_PREFIX='/api'
// const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
module.exports = {
  EMAIL_LOGIN: `/api/users/login/email`,
  ATTACHMENTS: `/api/admin/attachments`,
  DEPARTMENTS: `/api/admin/departments`,
  USERS: `/api/admin/users`,
  UPLOAD: `/api/admin/attachments/upload`,
  UPLOADS: `/api/admin/attachments/uploads`,
  ARTICLE: `/api/admin/articles`,
  PICTURE: `/api/admin/pictures`,
  REFRESH_TOKEN: '/api/auth/refresh_token'
}
