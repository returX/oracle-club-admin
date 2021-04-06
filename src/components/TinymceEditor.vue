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
import {METHOD, request} from "@/utils/request";

export default {
  props: {
    content: {
      type: String,
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table textcolor ' +
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
        images_upload_handler: (blobInfo, success) => {
          let formdata = new FormData()
          formdata.append("file",blobInfo.blob(),blobInfo.filename())
          request("http://localhost:8081/api/admin/attachments/upload", METHOD.POST,formdata).then(function (res){
            console.log(res)
            success("http://localhost:8081/"+res.data.data.path)
          })
        }
      }
    }
  },
  methods: {
    setup(editor){
      console.log(editor)
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

<style scoped>

</style>