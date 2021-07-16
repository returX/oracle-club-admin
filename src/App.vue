<template>
  <a-config-provider :get-popup-container="popContainer">
    <router-view/>
  </a-config-provider>
</template>

<script>
import {enquireScreen} from './utils/util'
import {mapState, mapMutations} from 'vuex'
import themeUtil from '@/utils/themeUtil';
import {getRouteKey} from '@/utils/routerUtil'

export default {
  name: 'App',
  data() {
    return {
    }
  },
  created () {
    this.setHtmlTitle()
    enquireScreen(isMobile => this.setDevice(isMobile))
  },
  mounted() {
   this.setWeekModeTheme(this.weekMode)
  },
  watch: {
    weekMode(val) {
      this.setWeekModeTheme(val)
    },
    $route() {
      this.setHtmlTitle()
    },
    'theme.mode': function(val) {
      let closeMessage = this.$message.loading(`您选择了主题模式 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(this.theme.color, val).then(closeMessage)
    },
    'theme.color': function(val) {
      let closeMessage = this.$message.loading(`您选择了主题色 ${val}, 正在切换...`)
      themeUtil.changeThemeColor(val, this.theme.mode).then(closeMessage)
    },
    'layout': function() {
      window.dispatchEvent(new Event('resize'))
    }
  },
  computed: {
    ...mapState('setting', ['layout', 'theme', 'weekMode'])
  },
  methods: {
    ...mapMutations('setting', ['setDevice']),
    setWeekModeTheme(weekMode) {
      if (weekMode) {
        document.body.classList.add('week-mode')
      } else {
        document.body.classList.remove('week-mode')
      }
    },
    setHtmlTitle() {
      const route = this.$route
      const key = route.path === '/' ? 'home.name' : getRouteKey(route.matched[route.matched.length - 1].path)
      // todo k
      document.title = process.env.VUE_APP_NAME + ' | ' + key
    },
    popContainer() {
      return document.getElementById("popContainer")
    }
  }
}
</script>

<style lang="less" scoped>
  #id{
  }
</style>
