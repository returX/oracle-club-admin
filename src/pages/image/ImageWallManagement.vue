<template>
<div class="image-wall">
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
              :disabled="selectedPicturesId.length === 0"
              @confirm="handleDeletePictureInBatch"
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
        <a-select v-model="queryParam.type"
                  style="width: 120px;float: right"
                  placeholder="全部类型"
                  allowClear
                  @change="handleListPicture"
        >
          <a-select-option v-for="(type,index) in types" :key="index" :value="type">{{ type }}</a-select-option>
        </a-select>
      </a-card>
    </a-col>
    <a-col :span="24">
      <a-list
          :grid="{ gutter: 12, xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }"
          :dataSource="pictures"
          :loading="listLoading"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a-card
              :bodyStyle="{ padding: 0 }"
              :hoverable="true">
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
          <a-checkbox
              :class="`select-picture-checkbox ${getCheckStatus(item.id) ? 'checkbox-checked' : ''}`"
              :checked="getCheckStatus(item.id)"
              @click="handleSelectedCheckbox($event,item)"
              v-show="supportMultipleSelection"
          ></a-checkbox>
        </a-list-item>
      </a-list>
    </a-col>
  </a-row>
  <a-modal
      title="上传图片"
      v-model="uploadVisible"
      :footer="null"
      @cancel="handleListPicture"
      destroyOnClose
  >
    <FileUpload
        ref="upload"
        :other="{type:uploadType}"
        :uploadHandler="uploadHandler"
        @change="handleFileChange"
    ></FileUpload>
    <a-row type="flex" align="middle" :style="{marginTop:'.5rem'}">
      <a-col :style="{marginRight:'.5rem'}">
        图片类型:
      </a-col>
      <a-col flex="auto">
        <a-select v-model="uploadType"
                  :style="{width:'100%'}"
                  :filterOption="false"
                  mode="combobox"
        >
          <a-select-option v-for="(type,index) in types" :key="index" :value="type">{{ type }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
  </a-modal>
</div>
</template>

<script>
import pictureApi from "@/services/picture";
import FileUpload from "@/components/upload/FileUpload";
import {isImage} from "@/utils/util";
import _ from 'lodash';


export default {
  name: "ImageWallManagement",
  components:{
    FileUpload
  },
  data(){
    return{
      pictures: [],
      listLoading: false,
      types:[],
      uploadVisible: false,
      supportMultipleSelection: false,
      uploadHandler: pictureApi.uploads,
      selectedCheckbox:{},
      uploadType: "default",
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
        type: undefined,
      },
    }
  },
  mounted() {
    this.handleListPicture()
    this.handleListPictureTypes()
  },
  computed:{
    selectedPicturesId(){
      if (!this.selectedCheckbox){
        return []
      }
      const arr = _.pickBy(this.selectedCheckbox,value=>value)
      return Object.keys(arr)
    }
  },
  methods:{
    handleListPicture(){
      this.listLoading = true
      pictureApi.list(this.queryParam).then(resp=>{
        if (resp.data.result === 'ok'){
          this.pictures = resp.data.data.content
        }
      }).finally(()=>{
        this.listLoading = false
      })
    },
    handleListPictureTypes(){
      pictureApi.types().then(resp=>{
        if (resp.data.result === 'ok'){
          this.types = resp.data.data
        }
      })
    },
    handleDeletePictureInBatch(){
      pictureApi.deleteBatch(this.selectedPicturesId).then(resp=>{
        if (resp.data.result === 'ok'){
          this.$message.success("批量删除图片成功")
        }
        this.handleListPicture();
      })
    },
    handleMultipleSelection(){
      this.supportMultipleSelection = true
      this.pictures.forEach(item => {
        this.$set(this.selectedCheckbox, item.id, false)
      })
    },
    handleCancelMultipleSelection(){
      this.selectedCheckbox = {}
      this.supportMultipleSelection = false
    },
    handleSelectedCheckbox(e,item){
      const checked = e.target.checked || false
      const {id} = item
      //选中
      if (checked){
        this.$set(this.selectedCheckbox,id,true)
      }else {
        this.$set(this.selectedCheckbox,id,false)
      }
    },
    getCheckStatus(key){
      return this.selectedCheckbox[key] || false
    },
    handleFileChange({file}){
      if (!isImage(file.type)){
        this.$message.warn("请选择图片格式!")
        this.$refs.upload.handleRemoveFile(file)
      }
    },
  }
}
</script>

<style scoped lang="less">
.image-wall{
  .select-picture-checkbox {
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
  .checkbox-checked{
    border: 2px solid @primary-color;
  }
}
</style>
