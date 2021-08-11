<template>
  <div>
    <a-row type="flex" justify="space-around" style="margin-bottom: 20px">
      <a-col :flex="21">
        <a-input v-model="articleDetail.title" placeholder="输入标题" />
      </a-col>
      <a-col>
        <a-button-group>
          <a-button type="primary"
                    @click="handlePrePublishArticle">发布文章</a-button>
          <ReactiveButton
              type="danger"
              text="保存草稿"
              loadedText="保存成功"
              erroredText="保存失败"
              :loading="draftSaving"
              :errored="draftSaveError"
              @click="handleSaveDraft"
              @callback="handleErrorSaveDraft"
          />
        </a-button-group>
      </a-col>
    </a-row>
    <tinymce-editor
        ref="editor"
        :content="articleDetail.content"
        @contentChange="handleContentChange"
        @image-upload="handleImageUpload"
    >
    </tinymce-editor>
    <article-setting-drawer
        :article="articleDetail"
        :save-draft-button="false"
        v-model="articleSettingVisible"
    />
  </div>
</template>

<script>
import TinymceEditor from "@/components/tinymce/TinymceEditor";
import articleApi from "@/services/artcle";
import ReactiveButton from "@/components/button/ReactiveButton";
import ArticleSettingDrawer from "@/components/drawer/ArticleSettingDrawer";
import {articleStatus} from "@/utils/constants";

function getText(html){
  const reg = /<(\S*?)[^>]*>.*?|<.*? \/>|\r\n|\r|\n|/g
  const htmlChar = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"', 'ldquo': '“', 'rdquo': '”' };
  let content = html.replace(reg,'').replace(/&(lt|gt|nbsp|amp|quot|ldquo|rdquo);/ig,function (match,q){
    return htmlChar[q]
  })
  return content
}
const imgUrlReg = /<img.*?src="(.*?)".*?>/g

export default {
  name: "ArticleNew",
  components:{
    ArticleSettingDrawer,
    ReactiveButton,
    TinymceEditor
  },
  data() {
    return {
      articleDetail: {},
      content: '<p>Hello World(X)    Hello TinyMCE(√) //todo 为图片库添加一个字段，用来区分 封面大图、轮播图、教师、瀑布流</p>',
      draftSaveError: false,
      draftSaving: false,
      articleSettingVisible: false
    }
  },
  mounted() {
    const id = this.$route.query.id
    if (id){
      articleApi.get(id).then(resp=>{
        if (resp.data.result === "ok"){
          this.articleDetail = resp.data.data
        }
      })
    }
  },
  methods: {
    handleContentChange(content){
      this.articleDetail.content = content
      this.articleDetail.contentText = getText(content)
    },
    handleErrorSaveDraft(){
      if (this.savedErrored){
        this.savedErrored = false
      }
    },
    handleSaveDraft(){
      this.draftSaving = true
      this.articleDetail.status = articleStatus.UNPUBLISHED
      if (this.articleDetail.id){
        //更新
        articleApi.update(this.articleDetail).then(resp=>{
          if (resp.data.result === "ok"){
            this.articleDetail = resp.data.data
          }
        }).finally(()=>setTimeout(()=>this.draftSaving = false,1000))
      }else {
        //新建
        articleApi.create(this.articleDetail).then(resp=>{
          if (resp.data.result === "ok"){
            this.articleDetail = resp.data.data
          }
        }).finally(()=>setTimeout(()=>this.draftSaving = false,1000))
      }
    },
    /**
     * 监听图片上传事件
     */
    handleImageUpload(image){
      if (image.path){
        this.articleDetail.coverImage = image.path
      }
    },
    /**
     * 准备发布文章，打开设置抽屉
     */
    handlePrePublishArticle(){
      const result = imgUrlReg.exec(this.articleDetail.content)
      this.articleDetail.coverImage = result[1]
      this.articleSettingVisible = true
    }
  }
}
</script>

<style lang="less" scoped>

</style>
