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
            <a-button
                type="primary"
                icon="cloud-upload"
                @click="() => (uploadVisible = true)"
            >上传</a-button>
            <a-button
                icon="select"
                v-show="!supportMultipleSelection"
                @click="handleMultipleSelection"
            >批量操作</a-button>
            <a-popconfirm
                title="确定要删除吗？"
                ok-text="是"
                cancel-text="否"
                @confirm="handleDeleteAttachmentInBatch"
            >
              <a-button
                  type="danger"
                  icon="delete"
                  v-show="supportMultipleSelection"
              >
                删除
              </a-button>
            </a-popconfirm>
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
                @click="handleShowDetailDrawer(item)"
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
              <a-card-meta class="p-3">
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
    <a-modal
        title="上传附件"
        v-model="uploadVisible"
        :footer="null"
        @cancel="handleListAttachments"
        destroyOnClose
    >
      <FileUpload
          ref="upload"
          :uploadHandler="uploadHandler"
      ></FileUpload>
    </a-modal>
    <attachment-detail-drawer
        v-model="drawerVisible"
        v-if="selectAttachment"
        :attachment="selectAttachment"
    />
  </div>
</template>

<script>
import AttachmentDetailDrawer from "@/components/drawer/AttachmentDetailDrawer";
import FileUpload from "@/components/upload/FileUpload";
import attachmentApi from "@/services/attachment";

export default {
  name: "AttachmentManagement",
  components: {AttachmentDetailDrawer,FileUpload},
  data(){
    return{
      attachments: [],
      drawerVisible : false,
      selectAttachment: {},
      selectedAttachmentCheckbox: {},
      selectedAttachmentsId: [],
      supportMultipleSelection : false,
      uploadVisible: false,
      uploadHandler: attachmentApi.uploads,
      pagination: {
        page: 1,
        size: 18,
        sort: null,
        total: 1
      },
      queryParam: {
        page: 0,
        size: 18,
        sort: null,
        name: null,
        suffix: null
      },
      listLoading:false
    }
  },
  mounted() {
    this.handleListAttachments()
  },
  methods:{
    handleShowPreview(attachment){
      const {mediaType} = attachment
      if (mediaType.startsWith('image')){
        return false
      }
      return true
    },
    handleListAttachments(){
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
    handleShowDetailDrawer(attachment) {
      this.selectAttachment = attachment
      if (this.supportMultipleSelection) {
        this.drawerVisible = false
      } else {
        this.drawerVisible = true
      }
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
    handleMultipleSelection() {
      this.supportMultipleSelection = true
      // 不允许附件详情抽屉显示
      this.drawerVisible = false
      this.attachments.forEach(item => {
        this.$set(this.selectedAttachmentCheckbox, item.id, false)
      })
    },
    getCheckStatus(key) {
      return this.selectedAttachmentCheckbox[key] || false
    },
    handleDeleteAttachmentInBatch(){
      attachmentApi.deleteBatch(this.selectedAttachmentsId).then(resp=>{
        //todo 删除附件
        if (resp.data.result === 'ok'){
          this.handleListAttachments()
        }else {
          this.$message.warn("删除附件失败")
        }
      })
    },
    handleCancelMultipleSelection(){
      this.supportMultipleSelection = false
      this.drawerVisible = false
      this.selectedAttachmentsId = []
      this.attachments.forEach(item => {
        this.$set(this.selectedAttachmentCheckbox, item.id, false)
      })
    },
    handlePaginationChange(page,size){
      console.log(page,size)
      this.pagination.page = page
      this.pagination.size = size
      this.handleListAttachments()
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