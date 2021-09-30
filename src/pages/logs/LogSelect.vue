<template>
<a-card>
  <div style="margin-bottom: 20px">
    <a-button type="primary">保存日志</a-button>
  </div>
  <a-table
      :columns="operationColumns"
      :dataSource="logs"
      :pagination="false"
  >
    <div slot="type" slot-scope="text">
      <a-tag color="#2db7f5">{{text}}</a-tag>
    </div>

    <div slot="result" slot-scope="text">
      <a-tag v-if="text === 1" color="blue">成功</a-tag>
      <a-tag v-else color="red">失败</a-tag>
    </div>
    <div slot="createdAt" slot-scope="text">
      {{text | moment}}
    </div>

    <div slot="memo" slot-scope="text">
      <span v-if="text">{{text}}</span>
      <span>-</span>
    </div>
    <a-button slot="action" slot-scope="text,record" @click="showDetails(record)">查看详情</a-button>
  </a-table>
  <a-modal
      v-if="detail"
      v-model="modalVisible"
      title="日志详情"
      :footer="null">
    <p>编号：{{detail.id}}</p>
    <p>类型：{{detail.type}}</p>
    <p>操作人：{{detail.name}}</p>
    <p>{{detail.content}}</p>
    <p>操作时间：{{detail.createdAt | moment}}</p>
  </a-modal>
</a-card>
</template>

<script>

import logsApi from "@/services/logs";

export default {
  name: "LogSelect",
  data(){
    return{
      modalVisible:false,
      detail:null,
      loading: true,
      logs:[],
      operationColumns: [
        {
          title: '操作类型',
          dataIndex: 'type',
          key: 'type',
          scopedSlots: {
            customRender: 'type'
          },
        },
        {
          title: '操作人',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '执行结果',
          dataIndex: 'result',
          key: 'result',
          scopedSlots: {
            customRender: 'result'
          },
        },
        {
          title: '操作时间',
          dataIndex: 'createdAt',
          key: 'createdAt',
          scopedSlots: {
            customRender: 'createdAt'
          },
        },
        {
          title: '备注',
          dataIndex: 'memo',
          key: 'memo',
          scopedSlots: {
            customRender: 'memo'
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots:{
            customRender: 'action'
          }
        }
      ],
      pagination: {
        page: 1,
        size: 10,
        sort: null,
        total: 1
      },
      queryParams:{
        page: 1,
        size: 10,
        sort: null,
      }
    }
  },
  mounted() {
    this.handlePageLogs()
  },
  methods:{
    handlePageLogs(){
      this.loading = true
      this.queryParams.size = this.pagination.size
      this.queryParams.page = this.pagination.page
      logsApi.page(this.queryParams).then(({data})=>{
        if (data.result === "ok"){
          this.logs = data.data.records
          this.pagination.total = data.data.total
        }
        this.loading = false
      })
    },
    showDetails(record){
      console.log(record)
      this.modalVisible = true
      this.detail = record
    }
  }
}
</script>

<style scoped>

</style>
