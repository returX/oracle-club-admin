<template>
<a-card>
  <div style="margin-bottom: 20px">
    <a-button type="primary">保存日志</a-button>
  </div>
  <a-table
      :columns="operationColumns"
      :dataSource="operation"
      :pagination="false"
  >
    <a-button slot="action" slot-scope="text,record" @click="showDetails(record)">查看详情</a-button>
  </a-table>
  <a-modal
      v-if="detail"
      v-model="modalVisible"
      title="日志详情"
      :footer="null">
    <p>{{detail.key}}</p>
    <p>{{detail.type}}</p>
    <p>{{detail.name}}</p>
  </a-modal>
</a-card>
</template>

<script>

export default {
  name: "LogSelect",
  data(){
    return{
      modalVisible:false,
      detail:null,
      operation:[
        {
          key: 'op1',
          type: '订购关系生效',
          name: '曲丽丽',
          result: 'agree',
          createAt: '2017-10-03  19:23:12',
          memo: '-'
        },
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          result: 'reject',
          createAt: '2017-10-03  19:23:12',
          memo: '不通过原因'
        },
      ],
      operationColumns: [
        {
          title: '操作类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: '操作人',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '执行结果',
          dataIndex: 'result',
          key: 'result'
        },
        {
          title: '操作时间',
          dataIndex: 'createAt',
          key: 'createAt'
        },
        {
          title: '备注',
          dataIndex: 'memo',
          key: 'memo'
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots:{
            customRender: 'action'
          }
        }
      ]
    }
  },
  methods:{
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