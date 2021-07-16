<template>
  <div class="card-list">
    <a-row
        :gutter="12"
        type="flex"
        align="middle"
    >
      <a-col
          :span="24"
          class="pb-3"
      >
        <a-card
            :bordered="false"
            :bodyStyle="{ padding: '16px' }"
        >
          <a-space>
            <a-popconfirm
                title="确定要清空回收站吗？"
                ok-text="是"
                cancel-text="否"
                @confirm="handleDeleteAttachmentAll"
            >
              <a-button
                  type="danger"
                  icon="delete"
              >
                清空回收站
              </a-button>
            </a-popconfirm>

            <a-button
                icon="select"
                v-show="!supportMultipleSelection"
                @click="handleMultipleSelection"
            >批量操作</a-button>
            <a-button
                type="danger"
                icon="delete"
                @click="handleDeleteAttachmentInBatch"
                v-show="supportMultipleSelection"
            >
              删除
            </a-button>
            <a-button
                type="primary"
                icon="rollback"
                @click="handleRollbackAttachment"
                v-show="supportMultipleSelection"
            >
              还原
            </a-button>
            <a-button
                icon="close"
                v-show="supportMultipleSelection"
                @click="handleCancelMultipleSelection"
            >
              取消
            </a-button>

          </a-space>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-list
            :grid="{ gutter: 12, xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }"
            :dataSource="attachments"
            :loading="listLoading"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <a-card
                :bodyStyle="{ padding: 0 }"
                :hoverable="true">
              <div class="thumb">
                <span v-show="handleShowPreview(item)">该格式不支持预览</span>
                <img
                    v-show="!handleShowPreview(item)"
                    :src="item.thumbPath"
                    :alt="item.name"
                    loading="lazy"
                >
              </div>
              <a-card-meta class="p-3 meta-content">
                <template #description>
                  {{ item.name }}
                </template>
              </a-card-meta>
              <a-checkbox
                  class="select-attachment-checkbox"
                  :style="getCheckStatus(item.id) ? {border: `2px solid red`} : ''"
                  :checked="getCheckStatus(item.id)"
                  @click="handleAttachmentSelectionChanged($event, item)"
                  v-show="supportMultipleSelection"
              ></a-checkbox>
            </a-card>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
    <div class="page-wrapper">
      <a-pagination
          class="pagination"
          :current="pagination.page"
          :total="pagination.total"
          :defaultPageSize="pagination.size"
          :pageSizeOptions="['18', '36', '54', '72', '90', '108']"
          showSizeChanger
          @change="handlePaginationChange"
          @showSizeChange="handlePaginationChange"
          showLessItems
      />
    </div>
  </div>
</template>

<script>
import attachmentApi from "@/services/attachment";
//todo 清空回收站
export default {
  name: "AttachmentBin",
  data(){
    return{
      attachments: [],
      listLoading: false,
      pagination: {
        page: 1,
        size: 108,
        sort: null,
        total: 1
      },
      queryParam: {
        page: 0,
        size: 108,
        sort: null,
        name: null,
        suffix: null,
        deleted: true,
      },
      selectedAttachmentCheckbox: {},
      selectedAttachmentsId: [],
      supportMultipleSelection : false,
    }
  },
  mounted() {
    this.handleListAttachmentsDeleted()
  },
  methods:{
    handleListAttachmentsDeleted(){
      this.listLoading = true
      this.queryParam.page = this.pagination.page - 1
      this.queryParam.size = this.pagination.size
      this.queryParam.sort = this.pagination.sort
      attachmentApi.list(this.queryParam)
          .then(resp=>{
            this.attachments = resp.data.data.content
            this.pagination.total = resp.data.data.totalElements
          }).finally(()=>{
        setTimeout(()=>{
          this.listLoading = false
        },200)
      })
    },
    handleShowPreview(attachment){
      const {mediaType} = attachment
      if (mediaType.startsWith('image')){
        return false
      }
      return true
    },
    getCheckStatus(key) {
      return this.selectedAttachmentCheckbox[key] || false
    },
    handleAttachmentSelectionChanged(e, item) {
      let isChecked = e.target.checked || false
      if (isChecked) {
        this.$set(this.selectedAttachmentCheckbox, item.id, true)
        this.selectedAttachmentsId.push(item.id)
      } else {
        this.$set(this.selectedAttachmentCheckbox, item.id, false)
        // 从选中id集合中删除id
        let index = this.selectedAttachmentsId.indexOf(item.id)
        this.selectedAttachmentsId.splice(index, 1)
      }
    },
    handleMultipleSelection(){
      this.supportMultipleSelection = true
      this.attachments.forEach(item => {
        this.$set(this.selectedAttachmentCheckbox, item.id, false)
      })
    },
    handleCancelMultipleSelection(){
      this.supportMultipleSelection = false
      this.selectedAttachmentsId = []
      this.attachments.forEach(item => {
        this.$set(this.selectedAttachmentCheckbox, item.id, false)
      })
    },
    handleDeleteAttachmentInBatch(){
      attachmentApi.deleteBatch(this.selectedAttachmentsId,{soft:false}).then(resp=>{
        if (resp.data.result === 'ok'){
          this.handleListAttachmentsDeleted()
        }else {
          this.$message.warn("删除附件失败")
        }
      })
    },
    handlePaginationChange(page,size){
      console.log(page,size)
      this.pagination.page = page
      this.pagination.size = size
      this.handleListAttachmentsDeleted()
    },
    handleRollbackAttachment(){
      attachmentApi.rollback(this.selectedAttachmentsId).then(resp=>{
        if (resp.data.result === 'ok'){
          this.handleListAttachmentsDeleted()
        }else {
          this.$message.warn(resp.data.msg)
        }
      })
    },
    handleDeleteAttachmentAll(){
      const ids = this.attachments.map(item=>item.id)
      console.log(ids)
      attachmentApi.deleteBatch(ids,{soft:false})
          .then(resp=>{
            console.log(resp)
            if (resp.data.result === 'ok'){
              this.$message.info("回收站清空成功")
            }else{
              this.$message.warn(resp.data.msg)
            }
          this.handleListAttachmentsDeleted()
      })
    }
  }
}
</script>

<style lang="less">
.card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 48px;
}
.meta-content{
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ant-card-meta{
  padding: 8px 4px;
}
.select-attachment-checkbox {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 10;

  .ant-checkbox {
    margin-left: 4px;
  }
}
.page-wrapper{
  float: right;
}
</style>
