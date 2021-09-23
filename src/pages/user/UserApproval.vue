<template>
  <a-card>
    <div>
      <i-table
          :columns="columns"
          :dataSource="dataSource"
          :rowKey="record=>record.id"
          :pagination="{current:pagination.page,total:pagination.total}"
          :loading="loading"
          @change="handleTableChange"
      >
        <div slot="ipAddr"
            slot-scope="{text}"
        >
          {{text | nullFormat}}
        </div>
        <div slot="createdAt"
              slot-scope="{text}"
        >
          {{text | moment}}
        </div>
        <div slot="action"
          slot-scope="{record}"
        >
          <a-space>
            <a-button @click="handleAgreed(record)" type="primary">
              同意
            </a-button>
            <a-button @click="handleRefused(record)" type="danger">
              拒绝
            </a-button>
          </a-space>
        </div>
      </i-table>
    </div>
  </a-card>
</template>

<script>
import ITable from "@/components/table/ITable";
import userApi from "@/services/user";
import {userStatus} from "@/utils/constants";

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '学号',
    dataIndex: 'stuNum',
    sorter:(a,b) => a-b
  },
  {
    title: '邮箱',
    dataIndex: 'email',
  },
  {
    title: '手机号码',
    dataIndex: 'phNum',
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddr',
    scopedSlots: {customRender: 'ipAddr'}
  },
  {
    title: '申请时间',
    dataIndex: 'createdAt',
    scopedSlots: { customRender: 'createdAt' },
    sorter:(a,b)=>a.createdAt - b.createdAt
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: "UserApproval",
  components: {ITable},
  data () {
    return {
      columns: columns,
      dataSource: [],
      loading:false,
      pagination: {
        page: 1,
        size: 10,
        sort: null,
        total: 1,
      },
      queryParams:{
        page: 1,
        size: 10,
        sort: null,
        status: userStatus.NOT_ACTIVE
      }
    }
  },
  mounted() {
    this.handleListUser()
  },
  methods: {
    handleListUser(){
      this.queryParams.size = this.pagination.size
      this.queryParams.page = this.pagination.page
      this.loading = true
      userApi.list(this.queryParams).then(resp=>{
        console.log(resp)
        const records = resp.data.data.records
        this.dataSource = records.map(record => this._.omit(record,"department"))
        this.pagination.total = resp.data.data.total
        this.loading = false
      })
    },
    handleTableChange(pagination) {
      console.log(pagination)
      this.pagination.page = pagination.current
      this.pagination.size = pagination.pageSize
      this.handleListUser()
    },
    handleAgreed(record){
      const updateRecord = {...record}
      updateRecord.status = userStatus.ACTIVE
      userApi.update(updateRecord).then(resp=>{
        if (resp.data.result === "ok"){
          this.handleListUser()
          this.$message.success("批准成功")
        }
      })
    },
    handleRefused(record){
      const updateRecord = {...record}
      updateRecord.status = userStatus.SUSPEND
      userApi.update(updateRecord).then(resp=>{
        if (resp.data.result === "ok"){
          this.handleListUser()
          this.$message.success("批准拒绝成功")
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
