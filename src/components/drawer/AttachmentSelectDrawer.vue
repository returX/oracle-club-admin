<template>
  <div>
    <a-drawer
        :title="title"
        :width="drawerWidth"
        closable
        :visible="visible"
        destroyOnClose
        @close="onClose"
    >
      <a-input-search
          placeholder="输入名称.."
          enter-button="搜索"
          v-model="queryParam.name"
          @search="handleSearch"
      />
      <a-divider/>
      <a-row
          type="flex"
      >
        <a-col :span="24">
          <a-list :data-source="attachments"
                  :split="false"
                  :grid="{ column:2 }"
                  :loading="loading">
            <a-list-item slot="renderItem" :key="item.id" slot-scope="item">
              <a-card
                  :bodyStyle="{ padding: 0 }"
                  :hoverable="true"
                  @click="handleSelectAttachment(item)"
              >
                <div class="thumb">
                  <span v-show="!handleShowPreview(item)">该格式不支持预览</span>
                  <img :src="item.thumbPath"
                       :alt="item.name"
                       v-show="handleShowPreview(item)"
                       loading="lazy"
                  >
                </div>
                <a-card-meta class="p-3">
                  <template #description>
                    {{ item.name }}
                  </template>
                </a-card-meta>
              </a-card>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
      <a-divider/>
      <a-pagination
          :current="pagination.page"
          :total="pagination.total"
          :defaultPageSize="pagination.size"
          @change="handlePaginationChange"
          showLessItems
      />
      <a-divider/>
      <div class="bottom-control">
        <a-button
            @click="handleShowUploadModal"
            type="primary"
        >上传附件</a-button>
      </div>
    </a-drawer>
    <a-modal
        title="上传附件"
        v-model="uploadVisible"
        :footer="null"
        :zIndex="1001"
        destroyOnClose
    >
      <FileUpload
          ref="upload"
          :uploadHandler="uploadHandler"
      />
    </a-modal>
  </div>
</template>

<script>
import attachmentApi from "@/services/attachment";
import FileUpload from "@/components/upload/FileUpload";

export default {
  name: "AttachmentSelectDrawer",
  components: {FileUpload},
  props:{
    drawerWidth: {
      type: Number,
      required: false,
      default: 480
    },
    title: {
      type: String,
      required: false,
      default: '选择附件'
    },
    visible: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  model: {
    prop: 'visible',
    event: 'close'
  },
  data(){
    return{
      attachments:[],
      loading: false,
      uploadVisible: false,
      uploadHandler: attachmentApi.uploads,
      pagination: {
        page: 1,
        size: 12,
        sort: null,
        total: 1
      },
      queryParam: {
        page: 1,
        size: 12,
        sort: null,
        name: null
      },
    }
  },
  mounted() {
    this.handleListAttachments()
  },
  methods:{
    onClose(){
      this.$emit("close",false)
    },
    handleSelectAttachment(item) {
      this.$emit('listenToSelect', item)
    },
    handleShowUploadModal(){
      this.uploadVisible = true
    },
    handleShowPreview(attachment){
      let mediaType = attachment.mediaType
      // 判断文件类型
      if (mediaType) {
        let prefix = mediaType.split('/')[0]
        if (prefix === 'image') {
          // 是图片
          return true
        } else {
          // 非图片
          return false
        }
      }
      // 没有获取到文件返回false
      return false
    },
    handlePaginationChange(page,size){
      this.pagination.page = page
      this.pagination.size = size
      this.handleListAttachments()
    },
    handleSearch(){
      this.handleListAttachments()
    },
    handleListAttachments(){
      this.listLoading = true
      this.queryParam.page = this.pagination.page
      this.queryParam.size = this.pagination.size
      this.queryParam.sort = this.pagination.sort
      attachmentApi.list(this.queryParam)
          .then(resp=>{
            console.log(resp)
            this.attachments = resp.data.data.records
            this.pagination.total = resp.data.data.total
          }).finally(()=>{
        setTimeout(()=>{
          this.listLoading = false
        },200)
      })
    }
  },
  watch:{
    uploadVisible(value, oldValue){
      if (!value && oldValue){
        this.handleListAttachments()
      }
    }
  }
}
</script>

<style lang="less">
.ant-card-meta{
  padding: 8px 4px;
}
</style>
