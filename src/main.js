import Vue from 'vue'
import App from './App.vue'
import {initRouter} from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
// import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
import '@/filter/filter'

import tinymce from 'tinymce'
import VueTinymce from '@packy-tang/vue-tinymce'
import _ from "lodash"


import VueClipboard from 'vue-clipboard2'


Vue.prototype.$tinymce = tinymce
Vue.prototype._ = _
Vue.use(VueTinymce)
Vue.use(VueClipboard)

const router = initRouter(store.state.setting.asyncRoutes)

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)

bootstrap({router, store, message: Vue.prototype.$message})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
