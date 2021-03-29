<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form>
      <a-form-item
          label="部门全名"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}">
        <a-input v-model="newDepartment.name" placeholder="部门名"></a-input>
      </a-form-item>
      <a-form-item
          label="部门别名"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}">
        <a-input v-model="newDepartment.aliasName" placeholder="部门别名"></a-input>
      </a-form-item>
      <a-form-item
          label="部门介绍"
          :labelCol="{span: 7}"
          :wrapperCol="{span: 10}">
        <a-textarea v-model="newDepartment.content" placeholder="输入部门介绍"></a-textarea>
      </a-form-item>
      <a-form-item style="margin-top: 24px" :wrapperCol="{span: 10, offset: 7}">
        <a-popconfirm
          title="确定创建部门吗?"
          @confirm="handleCreateDepartment"
        >
          <a-button type="primary">提交</a-button>
        </a-popconfirm>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
import departmentsApi from "@/services/departments";

export default {
  name: "DepartmentNew",
  data(){
    return{
      newDepartment:{
        name:null,
        aliasName:null,
        content:null
      }
    }
  },
  methods:{
    handleCreateDepartment(){
      departmentsApi.create(this.newDepartment).then(resp=>{
        if (resp.data.result === "ok"){
          this.$message.success("部门创建成功!")
          this.$router.push("select")
        }
      })
    }
  }
}
</script>

<style scoped>

</style>