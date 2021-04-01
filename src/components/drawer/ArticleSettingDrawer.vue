<template>
  <a-drawer
    title="文章设置"
    :width="540"
    placement="right"
    closable
    destroyOnClose
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose"
    :visible="visible"
  >
    <div>
      <div class="mb-4">
        <h3>基本设置</h3>
        <div>
          <a-form layout="vertical">
            <a-form-item
                label="文章标题："
            >
              <a-input v-model="selectArticle.title" />
            </a-form-item>
            <a-form-item
                label="文章摘要："
            >
              <a-textarea v-model="selectArticle.description"
                          :auto-size="{ minRows: 7, maxRows: 10 }"
              />
              <a-form-item
                  label="创建时间："
              >
                <a-date-picker show-time
                               @ok="onOk"
                               v-model="createdAt" />
              </a-form-item>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <a-divider/>
      <div class="mb-4">
        <h3>封面图</h3>
        <div>
          <div class="article-thumb">
            <img :src="selectArticle.coverImage || require('@/assets/img/placeholder.jpg')"
              @click="imageDrawerVisible = true"
            />
            <a-form layout="vertical">
              <a-form-item>
                <a-input
                    v-model.lazy="selectArticle.coverImage"
                    placeholder="点击封面图选择图片，或者输入外部链接"
                ></a-input>
              </a-form-item>
            </a-form>

            <a-button
                type="dashed"
                @click="selectArticle.coverImage = null"
            >移除</a-button>
          </div>
        </div>
      </div>
      <a-divider/>
      <div class="bottom-control">
        <ReactiveButton
            @click="handleSave"
            @callback="handleSavedCallback"
            :loading="saving"
            :errored="savedErrored"
            text="保存"
            loadedText="保存成功"
            erroredText="保存失败"
        ></ReactiveButton>
      </div>
    </div>
    <attachment-select-drawer
        v-if="imageDrawerVisible"
      v-model="imageDrawerVisible"
      @listenToSelect="handleSelectImage"
    />
  </a-drawer>
</template>

<script>
import moment from 'moment'
import AttachmentSelectDrawer from "@/components/drawer/AttachmentSelectDrawer";
import ReactiveButton from "@/components/button/ReactiveButton";
import articleApi from "@/services/artcle";

export default {
  name: "ArticleSettingDrawer",
  components: {AttachmentSelectDrawer,ReactiveButton},
  props:{
    article:{
      type: Object,
      required: true,
    },
    visible:{
      type: Boolean,
      required:false,
      default: true
    }
  },
  model: {
    prop: 'visible',
    event: 'close',
  },
  data(){
    return{
      selectArticle:this.article,
      createdAt:null,
      imageDrawerVisible: false,
      saving: false,
      savedErrored: false,
    }
  },
  watch:{
    article(val){
      this.selectArticle = val
      this.createdAt = moment(val.createdAt).format()
    }
  },
  methods:{
    onOk(value) {
      if (value){
        this.createdAt = moment(value).format()
        this.selectArticle.createdAt = value.unix() * 1000
      }
    },
    onClose(){
      this.$emit('close', false)
    },
    handleSelectImage(item){
      this.selectArticle.coverImage = item.path
      this.imageDrawerVisible = false
    },
    handleSave(){
      this.saving = true
      articleApi.update(this.selectArticle).then(resp=>{
        if (resp.data.result === "ok"){
          this.selectArticle = resp.data.data
        }else {
          this.savedErrored = true
        }
      }).finally(()=>{
        setTimeout(() => {
          this.saving = false
        }, 400)
      })
    },
    handleSavedCallback(){
      if (this.savedErrored){
        this.savedErrored = false
      }
    }
  }
}
</script>

<style scoped lang="less">
  .mb-4{
    margin-bottom: 1rem;
  }
  .article-thumb img{
    width: 100%;
    margin-bottom: .6rem;
  }
</style>