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
          <a-list :data-source="pictures"
                  :split="false"
                  :grid="{ column:2 }"
                  :loading="loading">
            <a-list-item slot="renderItem" :key="item.id" slot-scope="item">
              <a-card
                  :bodyStyle="{ padding: 0 }"
                  :hoverable="true"
                  @click="handleSelectPicture(item)"
              >
                <div class="thumb">
                  <img :src="item.thumbPath"
                       :alt="item.name"
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
        >上传图片</a-button>
      </div>
    </a-drawer>
    <a-modal
        title="上传图片"
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
import FileUpload from "@/components/upload/FileUpload";
import pictureApi from "@/services/picture";

export default {
  name: "PictureSelectDrawer",
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
      pictures:[],
      loading: false,
      uploadVisible: false,
      uploadHandler: pictureApi.uploads,
      pagination: {
        page: 1,
        size: 12,
        sort: null,
        total: 1
      },
      queryParam: {
        page: 0,
        size: 12,
        sort: null,
        name: null
      },
    }
  },
  mounted() {
    this.handleListPictures()
  },
  methods: {
    onClose() {
      this.$emit("close", false)
    },
    handleSelectPicture(item) {
      this.$emit('listenToSelect', item)
    },
    handleShowUploadModal() {
      this.uploadVisible = true
    },
    handlePaginationChange(page, size) {
      this.pagination.page = page
      this.pagination.size = size
      this.handleListPictures()
    },
    handleSearch() {
      this.handleListPictures()
    },
    handleListPictures() {
      this.listLoading = true
      this.queryParam.page = this.pagination.page - 1
      this.queryParam.size = this.pagination.size
      this.queryParam.sort = this.pagination.sort
      pictureApi.list(this.queryParam)
          .then(resp => {
            console.log(resp)
            this.pictures = resp.data.data.content
            this.pagination.total = resp.data.data.totalElements
          }).finally(() => {
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      })
    }
  }
}
</script>

<style scoped>

</style>
