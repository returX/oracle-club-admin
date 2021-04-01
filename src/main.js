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
import {initI18n} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import 'moment/locale/zh-cn'
import '@/filter/filter'

import tinymce from 'tinymce'
import VueTinymce from '@packy-tang/vue-tinymce'

import 'tinymce/skins/content/default/content.min.css'
import 'tinymce/skins/ui/oxide/skin.min.css'
import 'tinymce/skins/ui/oxide/content.min.css'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'

import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount' //字数统计
import 'tinymce/plugins/colorpicker' //颜色选择
import 'tinymce/plugins/textcolor' //文字颜色
import 'tinymce/plugins/preview' // 点击预览
import 'tinymce/plugins/textpattern' //快速排版(markdown)
import 'tinymce/plugins/help'
import './utils/tinymce/plugins/indent2em'
import './utils/tinymce/plugins/importword'
import './utils/tinymce/langs/zh_CN.js'

Vue.prototype.$tinymce = tinymce
Vue.use(VueTinymce)

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)

bootstrap({router, store, i18n, message: Vue.prototype.$message})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
