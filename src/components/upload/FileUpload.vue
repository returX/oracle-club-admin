<template>
  <div class="file-upload">
    <a-upload-dragger
        class="upload-edge"
        :multiple="true"
        :file-list="fileList"
        @change="handleFileChange"
        :remove="handleRemoveFile"
        :before-upload="beforeUpload"
    >
      <p class="ant-upload-text">
        点击选择文件或者将文件拖拽到此处
      </p>
    </a-upload-dragger>
    <a-button block
              :disabled="fileList.length === 0"
              type="primary"
              @click="handleUpload">
      {{uploading ? '正在上传...':'开始上传'}}
      <a-progress v-show="uploading"
                  :percent="percent"
                  :showInfo="false" />
    </a-button>
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  data(){
    return{
      fileList :[],
      uploading: false,
      percent:0,
    }
  },
  props:{
    uploadHandler: {
      type: Function,
      required: true,
    },
  },
  methods:{
    beforeUpload(file){
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleFileChange(e){
      this.$emit('change',e)
    },
    handleRemoveFile(file){
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    handleUpload(){
      this.uploading = true
      let formData = new FormData()
      this.fileList.forEach(item=>{
        formData.append("files",item)
      })
      this.uploadHandler(
          formData,
          (progressEvent)=>{
            let complete =
                (( (progressEvent.loaded / progressEvent.total) * 100) | 0);
            this.percent = complete
            if(complete >=100){
              this.uploading = false
              this.percent = 0; // 重新置0
            }
          },
      ).then(resp=>{
        console.log("resp",resp)
        if (resp.data.result === "ok"){
          this.$message.success("上传成功")
          this.fileList = []
        }else {
          this.$message.error(resp.data.msg)
        }
      }).catch(res=>{
        console.log(res)
      }).finally(()=>{
        this.uploading = false
      })
    },
  }
}
</script>

<style lang="less">
.file-upload{
  .upload-edge{
    .ant-upload{
      margin-bottom: .5rem;
    }
  }

  .ant-progress-outer{
    margin-right: 0;
    padding-right: 0;
    height: inherit;
    .ant-progress-inner,.ant-progress-bg{
      height: 100% !important;
      border-radius: 0 !important;
      border: none;
    }
  }
  .ant-btn{
    padding:0 !important;
    overflow: hidden;
    span{
      position: relative;
      z-index: 1002;
    }
  }
  .ant-progress{
    position: absolute;
    left: 0;
    top: 0;
    height: inherit;
    >div{
      height: inherit;
      position: relative;
    }

  }
  .ant-progress-text{
    position: absolute;
    top: 50%;
    left: 50%;
    margin:0 0 0 0;
  }
}

</style>