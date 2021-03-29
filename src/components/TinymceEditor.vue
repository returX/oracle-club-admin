<template>
  <div>
    <vue-tinymce
        :setting="setting"
        v-model="content"
    />
  </div>
</template>

<script>
import {METHOD, request} from "@/utils/request";

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table textcolor ' +
          'wordcount contextmenu wordcount preview textpattern help'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo |  formatselect fontsizeselect fontselect | bold italic | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | lists image ' +
          'media table | removeformat wordcount preview help'
    }
  },
  data() {
    return {
      content: "<p>Hello World(X)    Hello TinyMCE(√) //todo 为图片库添加一个字段，用来区分 封面大图、轮播图、教师、瀑布流</p>",
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
  },
  watch: {
    content:{
      handler: function (newValue) {
        this.$emit('input', newValue)
      },
      immediate: true
    },
  }
}
</script>

<style scoped>

</style>