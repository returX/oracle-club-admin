<template>
  <div>
    <a-row type="flex" justify="space-around" style="margin-bottom: 20px">
      <a-col :flex="21">
        <a-input placeholder="输入标题" />
      </a-col>
      <a-col>
        <a-button-group>
          <a-button type="primary">发布文章</a-button>
          <a-button type="danger">保存草稿</a-button>
        </a-button-group>
      </a-col>
    </a-row>
    <tinymce-editor
        ref="editor"
        v-model="content"
        :disabled="disabled">
    </tinymce-editor>
  </div>
</template>

<script>
import TinymceEditor from "@/components/TinymceEditor";

export default {
  name: "ArticleNew",
  components:{
    TinymceEditor
  },
  data() {
    return {
      content: 'Welcome to Use Tinymce Editor',
      disabled: false
    }
  },
  methods: {
    //清空内容
    clear() {

    }
  }
}
</script>

<style scoped>

</style>