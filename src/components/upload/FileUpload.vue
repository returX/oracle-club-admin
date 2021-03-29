<template>
  <div>
    <a-upload-dragger
        :multiple="true"
        :customRequest="customRequest"
        @change="handleChange"
    >
      <p class="ant-upload-text">
        点击选择文件或者将文件拖拽到此处
      </p>
    </a-upload-dragger>
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  data(){
    return{

    }
  },
  props:{
    uploadHandler: {
      type: Function,
      required: true,
    },
  },
  methods:{
    handleChange(e){
      console.log("e",e)
    },
    customRequest(data){
      let formData = new FormData()
      formData.append("file",data.file)
      this.uploadHandler(formData).then(res=>{
        data.onSuccess(res,data.file)
        console.log("res",res)
      })
    }
  }
}
</script>

<style scoped>

</style>