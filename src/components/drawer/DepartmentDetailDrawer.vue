<template>
  <a-drawer
      title="附件详情"
      :width="540"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
  >
    <a-row
        type="flex"
        align="middle"
    >
      <a-col :span="24">
        <a-list item-layout="horizontal">
          <a-list-item>
            <a-list-item-meta>
              <template
                  slot="description"
                  v-if="editable"
              >
                <a-input size="small" v-model="detail.name"/>
              </template>
              <template
                  slot="description"
                  v-else
              >{{ detail.name }}</template>
              <span slot="title">
                部门全称：
              </span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template
                  slot="description"
                  v-if="editable"
              >
                <a-input size="small" v-model="detail.aliasName"/>
              </template>
              <template
                  slot="description"
                  v-else
              >{{ detail.aliasName }}</template>
              <span slot="title">
                部门简称(别名)：
              </span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template
                  slot="description"
                  v-if="editable"
              >
                <a-textarea size="small" v-model="detail.content"/>
              </template>
              <template
                  slot="description"
                  v-else
              >{{ detail.content }}</template>
              <span slot="title">
                部门介绍：
              </span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template slot="description">
                {{ detail.createdAt | moment }}
              </template>
              <span slot="title">创建日期：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template slot="description">
                {{ detail.updatedAt | moment }}
              </template>
              <span slot="title">更新日期：</span>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
      <a-divider/>
      <a-col :span="24">
          <a-button type="primary"
            v-if="!editable"
            @click="handleEditOpen"
          >修改</a-button>
        <a-space
            v-else>
          <a-button type="primary"
            @click="handleUpdateDepartment"
          >保存</a-button>
          <a-popconfirm
            title="确定要取消修改吗?"
            @confirm="handleEditCancel"
          >
            <a-button type="dashed">取消</a-button>
          </a-popconfirm>
        </a-space>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
import departmentsApi from "@/services/departments";

export default {
  name: "DepartmentFormDrawer",
  data(){
    return{
      editable: false,
      detail: this.department,
      cacheData:null,
    }
  },
  props:{
    department: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  watch:{
    department(){
      this.detail = this.department
    }
  },
  model: {
    prop: 'visible',
    event: 'close',
  },
  methods:{
    onClose(){
      this.$emit("close",false)
    },
    handleEditOpen(){
      this.editable = true
      this.cacheData = JSON.parse(JSON.stringify(this.detail))
    },
    handleEditCancel(){
      this.editable = false
      Object.assign(this.detail,this.cacheData)
      this.cacheData = null
    },
    handleUpdateDepartment(){
      this.$message.success("更新部门")
      this.editable = false
      departmentsApi.update(this.detail).then(resp=>{
        console.log(resp.data)
        if (resp.data.res === "ok"){
          this.detail = resp.data.data
          this.cacheData = null
        }
      })
    }
  }
}
</script>

<style scoped>

</style>