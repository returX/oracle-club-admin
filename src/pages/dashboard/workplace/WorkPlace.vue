<template>
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <div class="title">{{welcome.timeFix[lang]}}，{{currUser.name}}，{{welcome.message[lang]}}</div>
      <div>{{currUser.nickname}}</div>
    </div>
    <template slot="extra">
      <head-info class="split-right" :title="$t('project')" content="56"/>
      <head-info class="split-right" :title="$t('ranking')" content="8/24"/>
      <head-info class="split-right" :title="$t('visit')" content="2,223"/>
    </template>
    <template>
      <a-row style="margin: 0 -12px">
        <a-col style="padding: 0 12px" :xl="16" :lg="24" :md="24" :sm="24" :xs="24">

          <a-card :loading="loading" :title="$t('log')" :bordered="false">
            <a slot="extra" @click="toLog">全部日志</a>
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in activities">
                <a-list-item-meta>
                  <div slot="title" v-html="item.template" />
                  <div slot="description">9小时前</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card :title="$t('access')" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="item-group">
              <a>操作一</a>
              <a>操作二</a>
              <a>操作三</a>
              <a>操作四</a>
              <a>操作五</a>
              <a>操作六</a>
              <a-button size="small" type="primary" ghost icon="plus">{{$t('add')}}</a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import HeadInfo from '@/components/tool/HeadInfo'
import {mapState} from 'vuex'

export default {
  name: 'WorkPlace',
  components: {HeadInfo, PageLayout},
  i18n: require('./i18n'),
  data () {
    return {
      projects: [],
      loading: true,
      activities: [],
      welcome: {
        timeFix: {
          CN: '早上好',
          HK: '早晨啊',
          US: 'Good morning',
        },
        message: {
          CN: '休息一会儿吧',
          HK: '休息一會兒吧',
          US: 'you may need a break',
        }
      }
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
    ...mapState('setting', ['lang'])
  },
  methods:{
    toLog(){
      this.$router.push("/logs")
    }
  },
  created() {
    // request.get('/user/welcome').then(res => this.welcome = res.data)
    // request.get('/work/activity').then(res => this.activities = res.data)
    // request.get('/project').then(res => {
    //     this.projects = res.data
    //     this.loading = false
    //   })
  }
}
</script>

<style lang="less">
@import "index";
</style>
