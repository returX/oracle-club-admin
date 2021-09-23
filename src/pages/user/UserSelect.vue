<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input
                    v-model="queryParams.name"
                    placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="学号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input
                    v-model="queryParams.stuNum"
                    placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="邮箱"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input type="email"
                         v-model="queryParams.email"
                         placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="登录时间"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-range-picker style="width: 100%"
                               v-model="dateRange"
                               format="YYYY-MM-DD"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="手机号码"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input type="tel"
                         v-model="queryParams.phNum"
                         placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="部门名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select placeholder="请选择"
                          v-model="queryParams.depId"
                          allowClear>
                  <a-select-option v-for="dep in departments" :key="dep.id" :value="dep.id">{{dep.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-space>
            <a-button @click="handleListUser" type="primary">查询</a-button>
            <a-button @click="handleResetForm">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </a-space>
        </span>
      </a-form>
    </div>
    <div>
      <a-space class="operator">
        <a-button type="primary">新建</a-button>
        <a-button
            @click="()=> canChecked = true"
            v-if="!canChecked"
        >批量操作</a-button>
        <a-popconfirm
            title="确定要删除吗？"
            ok-text="是"
            cancel-text="否"
            v-if="canChecked"
            @confirm="handleDeleteUserInBatch"
        >
          <a-button
              type="danger"
              icon="delete"
          >
            删除
          </a-button>
        </a-popconfirm>
        <a-button
            icon="close"
            v-if="canChecked"
            @click="handleCancelSelection"
        >
          取消
        </a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="audit">审批</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </a-space>
      <i-table
          :columns="columns"
          :dataSource="dataSource"
          :selectedRows.sync="selectedRows"
          :pagination="{current:pagination.page,total:pagination.total}"
          :canChecked="canChecked"
          :loading="loading"
          :rowKey="record => record.id"
          @change="handleTableChange"
      >

        <template
            v-for="col in ['name', 'stuNum', 'nickname', 'depName' ,'email', 'phNum', 'role']"
            :slot="col"
            slot-scope="{text, record}"
        >
          <div :key="col">
            <a-select
                v-if="record.editable && col === 'depName'"
                size="small"
                :showArrow="false"
                :defaultValue="record.department.name"
                @change="(v)=> editUser.department.id = v"
            >
              <a-select-option v-for="dep in departments" :key="dep.id" :value="dep.id">
                {{dep.name}}
              </a-select-option>
            </a-select>

            <a-input
                v-else-if="record.editable"
                size="small"
                :value="text"
                @change="e => handleInputChange(e,col)"
            />

            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <div
            slot="status"
            slot-scope="{text}"
        >
          <a-badge
              :status="text | statusBadge"
              :text="text | statusFormat"
          />
        </div>

        <div
            slot="role"
            slot-scope="{text}"
        >
          <a-tag
            :color="text | roleColor"
          >
            {{text | roleFormat}}
          </a-tag>
        </div>

        <div
            slot="loginAt"
            slot-scope="{text,record}"
        >
          {{record.loginAt | nullFormat | moment}}
        </div>

        <div slot="action" slot-scope="{text, record}">

         <span v-if="!record.editable">
          <a-space>
            <a @click="edit(record.id)" :disabled="editUser">
              <a-icon type="edit"/>编辑
            </a>
            <a-popconfirm title="确认删除吗？" @confirm="deleteRecord(record.id)">
              <a :disabled="editUser">
                <a-icon type="delete" />删除
              </a>
            </a-popconfirm>
            <a @click="handleBan(record)"
              v-if="shouldBan(record.status)"
               :disabled="editUser">
              <a-icon type="lock"/>封禁
            </a>
            <a @click="handleBan(record,false)"
               v-else
               :disabled="editUser">
              <a-icon type="unlock"/>解封
            </a>
          </a-space>
         </span>
          <span v-else>
            <a-space>
             <a @click="() => save(record)">保存</a>
             <a-popconfirm title="确定取消?" @confirm="() => cancel(record.id)">
                <a>取消</a>
             </a-popconfirm>
            </a-space>
          </span>
        </div>
      </i-table>
    </div>
  </a-card>
</template>

<script>
import ITable from "@/components/table/ITable";
import departmentsApi from "@/services/departments";
import userApi from "@/services/user";
import _ from "lodash";
import {userStatus} from "@/utils/constants";

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width:100,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: '学号',
    dataIndex: 'stuNum',
    width: 100,
    scopedSlots: { customRender: 'stuNum' }
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    ellipsis: true,
    width: 150,
    scopedSlots: { customRender: 'nickname' }
  },
  {
    title: '部门名',
    dataIndex: 'department.name',
    width: 150,
    scopedSlots: { customRender: 'depName' }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    ellipsis: true,
    width: 200,
    scopedSlots: { customRender: 'email' }
  },
  {
    title: '手机号码',
    dataIndex: 'phNum',
    width: 150,
    scopedSlots: { customRender: 'phNum' }
  },
  {
    title: '状态',
    width: 100,
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '权限',
    width: 100,
    dataIndex: 'role',
    scopedSlots: { customRender: 'role' }
  },
  {
    title: '登录时间',
    dataIndex: 'loginAt',
    ellipsis: true,
    sorter: (a,b)=>a.loginAt-b.loginAt,
    scopedSlots: { customRender: 'loginAt' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: "UserSelect",
  components: {ITable},
  data () {
    return {
      advanced: false,
      columns: columns,
      dataSource: [],
      departments: [],
      selectedRows: [],
      editUser:null,
      cacheUser:null,
      canChecked: false,
      loading: false,
      pagination: {
        page: 1,
        size: 10,
        sort: null,
        total: 1,
      },
      dateRange:null,
      queryParams:{
        name:null,
        stuNum:null,
        phNum:null,
        email:null,
        depId:null,
        loginStart: null,
        loginEnd: null,
        page: 1,
        size: 10,
        sort: null,
      }
    }
  },
  mounted() {
    this.handleListDepartment()
    this.handleListUser()
  },
  methods: {
    shouldBan(status){
      if (status === userStatus.ACTIVE){
        return true
      }
      return false
    },
    deleteRecord(id) {
      this.loading = true
      userApi.delete(id).then(resp=>{
        if (resp.data.result === "ok"){
          console.log(resp)
          this.$message.success("删除用户成功")
        }
        this.loading = false
        this.handleListUser()
      })

    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    remove() {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    handleTableChange(pagination) {
      console.log(pagination)
      this.pagination.page = pagination.current
      this.pagination.size = pagination.pageSize
      this.handleListUser()
    },
    handleMenuClick(e) {
      if (e.key === 'audit') {
        this.$router.push("approval")
      }
    },
    handleDeleteUserInBatch(){
      const ids = this.selectedRows.map(item => item.id)
      userApi.deleteMulti(ids).then(resp=>{
        console.log(resp)
        if (resp.data.result === "ok")
          this.handleListUser()
      })
    },
    handleCancelSelection(){
      this.canChecked = false
      this.selectedRows = []
    },
    edit(id){
      const index = _.findIndex(this.dataSource,item=> id === item.id)
      if (index >= 0) {
        this.$set(this.dataSource[index],"editable",true)
        this.editUser = JSON.parse(JSON.stringify(this.dataSource[index]))
        this.cacheUser = JSON.parse(JSON.stringify(this.dataSource[index]))
      }
    },
    save(record){
      console.log(record)
      const index = _.findIndex(this.dataSource,item => record.id === item.id)
      if (index >= 0) {
        this.$delete(this.dataSource[index],"editable")
        userApi.update(this.editUser).then(resp=>{
          console.log(resp.data)
          if (resp.data.result === 'ok'){
            this.handleListUser()
            this.editUser = null
          }
        })
      }
      //todo 修改用户接口
    },
    cancel(id){
      const index = _.findIndex(this.dataSource,item => id === item.id)
      console.log(index)
      if (index >= 0) {
        this.$delete(this.dataSource[index],"editable")
        this.$delete(this.cacheUser,"editable")
        Object.assign(this.dataSource[index],this.cacheUser)
        this.editUser = null
        this.cacheUser = null
      }
    },
    handleBan(record,ban = true){
      const copyRecord = {...record}
      if (ban){
        copyRecord.status = userStatus.SUSPEND
      }else {
        copyRecord.status = userStatus.ACTIVE
      }
      userApi.update(copyRecord).then(resp=>{
        console.log(resp)
        if (resp.data.result === 'ok'){
          this.handleListUser()
        }
      })
    },
    handleInputChange(e,col){
      this.editUser[col] = e.target.value
    },
    handleListDepartment(){
      departmentsApi.list().then(resp=>{
        this.departments = resp.data.data
      })
    },
    handleResetForm(){
      this.dateRange = null
      this.queryParams = {}
      this.handlePaginationChange(1,10)
    },
    handlePaginationChange(page,size){
      this.pagination.page = page
      this.pagination.size = size
      this.handleListUser()
    },
    handleListUser(){
      this.queryParams.size = this.pagination.size
      this.queryParams.page = this.pagination.page
      if (this.dateRange){
        this.queryParams.loginStart = new Date(this.dateRange[0]._d).getTime()
        this.queryParams.loginEnd = new Date(this.dateRange[1]._d).getTime()
      }
      this.loading = true
      userApi.list(this.queryParams).then(resp=>{
        console.log(resp)
        this.dataSource = resp.data.data.records
        this.pagination.total = resp.data.data.total
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.search{
  margin-bottom: 54px;
}
.fold{
  width: calc(100% - 216px);
  display: inline-block
}
.operator{
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
