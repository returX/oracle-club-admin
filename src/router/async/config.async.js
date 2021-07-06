import routerMap from './router.map'
import {parseRoutes} from '@/utils/routerUtil'

// 异步路由配置
const routesConfig = [
  'login',
  'root',
]

const options = {
  routes: parseRoutes(routesConfig, routerMap)
}

export default options
