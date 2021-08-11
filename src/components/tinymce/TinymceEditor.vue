<template>
  <div>
    <vue-tinymce
        :setting="setting"
        v-model="contentData"
        :setup="setup"
    />
  </div>
</template>

<script>
import 'tinymce/themes/silver'
import 'tinymce/icons/default'

import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount' //字数统计
import 'tinymce/plugins/colorpicker' //颜色选择
import 'tinymce/plugins/textcolor' //文字颜色
import 'tinymce/plugins/preview' // 点击预览
import 'tinymce/plugins/textpattern' //快速排版(markdown)
import 'tinymce/plugins/help'
import './plugins/indent2em'
import './plugins/importword'
import './langs/zh_CN.js'
import attachmentApi from "@/services/attachment";

export default {
  props: {
    content: {
      type: String,
    },
    plugins: {
      type: [String, Array],
      default: 'lists image imagetools media table textcolor ' +
          'wordcount contextmenu wordcount preview textpattern indent2em importword help'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo |  formatselect fontsizeselect fontselect | bold italic | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | lists image ' +
          'media table | removeformat wordcount preview indent2em importword help'
    }
  },
  data() {
    return {
      contentData: '',
      editor: null,
      ready: false,
      setting:{
        height: 500,
        language: 'zh_CN',
        browser_spellcheck: true,
        branding: false, // 去水印
        elementpath: true, //禁用编辑器底部的状态栏
        statusbar: true, // 隐藏编辑器底部的状态栏
        paste_data_images: true, // 是否允许粘贴图像
        menubar: false, // 隐藏最上方menu
        fontsize_formats: '14px 16px 18px 20px 24px 26px 28px 30px 32px 36px', //字体大小
        font_formats:'微软雅黑=Microsoft YaHei,Helvetica Neue;PingFang SC;sans-serif;' +
            '苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;' +
            '宋体=simsun;serifsans-serif;' +
            'Terminal=terminal;monaco;' +
            'Times New Roman=times new roman;times', //字体
        file_picker_types: 'image',
        plugins: this.plugins,
        toolbar: this.toolbar,
        images_upload_handler: (blobInfo, success,failure) => {
          let formdata = new FormData()
          formdata.append("file",blobInfo.blob(),blobInfo.filename())
          attachmentApi.upload(formdata).then(({data})=>{
            if (data.result === 'ok'){
              this.$emit("image-upload",data.data)
              success(process.env.VUE_APP_API_BASE_URL+"/"+data.data.path)
            }else {
              failure(data.msg)
            }
          })
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    setup(editor){
      this.editor = editor
      // editor.on('input change undo redo execCommand KeyUp', function() {
      //   that.$emit('contentChange', that.editor.getContent(), that.editor.getContent({format:'text'}));
      // })
      // that.$emit('contentChange', that.editor.getContent(), that.editor.getContent({format:'text'}));
    }
  },
  watch: {
    content:{
      handler:function (newValue){
        this.contentData = newValue
      },
      immediate: true
    },
    contentData(newValue){
      this.$emit("contentChange",newValue)
    }
  }
}
</script>

<style lang="less" scoped>
@import './skins/content/default/content.min.css';
@import './skins/ui/oxide/skin.min.css';
@import './skins/ui/oxide/content.min.css';
</style>
