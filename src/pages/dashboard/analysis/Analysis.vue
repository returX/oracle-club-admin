<template>
  <div class="analysis">
    <a-row style="margin-top: 0" :gutter="[24, 24]">
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="用户总数" :total="statistic.userCount">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
<!--          <div>用户总数</div>-->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="访问量" :total="statistic.viewCount">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
<!--          <div>日均访问量<span>123,4</span></div>-->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="公告数" :total="statistic.articleCount">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
<!--          <div>转化率 <span>60%</span></div>-->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="上次更新时间" :total="statistic.now | moment">
          <a-tooltip title="指标说明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div style="white-space: nowrap;overflow: hidden">

          </div>
        </chart-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ChartCard from '../../../components/card/ChartCard'
import statisticApi from "@/services/statistic";

export default {
  name: 'Analysis',
  data () {
    return {
      statistic: {},
      loading: true
    }
  },
  created() {
    setTimeout(() => this.loading = !this.loading, 1000)
  },
  components: {ChartCard},
  mounted() {
    this.handleGetStatistic()
  },
  methods:{
    handleGetStatistic(){
      statisticApi.getStatisticAll().then(({data})=>{
          if (data.result === "ok"){
            this.statistic = data.data
          }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .extra-wrap{
    .extra-item{
      display: inline-block;
      margin-right: 24px;
      a:not(:first-child){
        margin-left: 24px;
      }
    }
  }
  @media screen and (max-width: 992px){
    .extra-wrap .extra-item{
      display: none;
    }
  }
  @media screen and (max-width: 576px){
    .extra-wrap{
      display: none;
    }
  }

</style>
