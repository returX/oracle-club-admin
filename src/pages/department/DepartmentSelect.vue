<template>
  <div class="card-list">
    <a-list
        :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
        :dataSource="dataSource"
        :loading="loading"
    >
      <a-list-item slot="renderItem" slot-scope="item">
          <template v-if="item.add">
            <a-button class="new-btn" type="dashed" @click="toNew">
              <a-icon type="plus" />新增部门
            </a-button>
          </template>
        <template v-else>
          <a-card :hoverable="true">
            <a-card-meta >
              <div style="margin-bottom: 3px" slot="title">{{item.name}}({{item.aliasName}})</div>
              <div class="meta-content" slot="description">{{item.content}}</div>
            </a-card-meta>
            <a slot="actions" @click="handleShowDrawer(item)">详情</a>
            <a-popconfirm
             title="确认删除吗?"
             @confirm="handleDeleteDepartment(item.id)"
             slot="actions"
            >
              <a>删除</a>
            </a-popconfirm>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
    <department-form-drawer
      v-model="drawerVisible"
      :department="selectDepartment"
    >

    </department-form-drawer>
  </div>
</template>

<script>
import departmentsApi from "@/services/departments";
import DepartmentFormDrawer from "@/components/drawer/DepartmentDetailDrawer";

export default {
  name: "DepartmentSelect",
  components: {DepartmentFormDrawer},
  data(){
    return{
      dataSource:[],
      loading: false,
      drawerVisible: false,
      selectDepartment:{},
    }
  },
  mounted() {
    this.handleListDepartment()
  },
  methods:{
    handleListDepartment(){
      this.loading = true
      departmentsApi.list().then(resp=>{
        if (resp.data.result === "ok"){
          console.log(resp.data.data)
          this.dataSource = resp.data.data
          this.dataSource.push({add:true})
        }else {
          this.$message.error("获取部门失败!")
        }
      }).finally(()=>this.loading = false)
    },
    handleShowDrawer(department){
      this.selectDepartment = department
      this.drawerVisible = true
    },
    handleDeleteDepartment(id){
      this.loading = true
      departmentsApi.delete(id).then(resp=>{
        console.log(resp.data)
        if (resp.data.result === "ok"){
          this.$message.success("删除部门成功")
        }
        this.loading = false
        this.handleListDepartment()
      })
    },
    toNew(){
      this.$router.push("new")
    },
  }
}
</script>

<style scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }
  .new-btn{
    border-radius: 2px;
    width: 100%;
    height: 187px;
  }
  .meta-content{
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>