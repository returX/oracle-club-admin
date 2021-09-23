<template>
<div class="index-image">
  <a-button type="primary"  @click="imageDrawerVisible = true">添加</a-button>
  <a-carousel arrows dots-class="slick-dots slick-thumb">
    <a slot="customPaging" slot-scope="props">
      <img :src="pictures[props.i].thumbPath | urlNormalize" />
    </a>
    <div class="image-wrap" :style="{
      backgroundImage: `url('${getImgUrl(item.path)}')`
    }" v-for="item in pictures" :key="item.id">
      <div class="image-editor">
        <div class="image-editor-item" @click="removePicture(item.id)">
          <a-icon type="delete" style="display: inline-block"/>
          <span>删除</span>
        </div>
      </div>
    </div>
  </a-carousel>
  <picture-select-drawer
      v-if="imageDrawerVisible"
      v-model="imageDrawerVisible"
      @listenToSelect="handleSelectImage"
  />
</div>
</template>

<script>
import PictureSelectDrawer from "@/components/drawer/PictureSelectDrawer";
import pictureApi from "@/services/picture";
export default {
  name: "IndexImageManagement",
  components:{PictureSelectDrawer},
  data(){
    return {
      imageDrawerVisible: false,
      pictures: [],
    }
  },
  mounted() {
    this.handleListIndexImage();
  },
  methods:{
    handleListIndexImage(){
      pictureApi.list({
        type: 'index'
      }).then(resp=>{
        console.log(resp)
        if (resp.data.result === 'ok'){
          this.pictures = resp.data.data.records
        }
      })
    },
    getImgUrl(i) {
      return `${process.env.VUE_APP_API_BASE_URL}/${i}`;
    },
    handleSelectImage(item){
      pictureApi.update(item.id,{
        type: 'index'
      }).then(resp =>{
        if (resp.data.result === 'ok'){
          this.imageDrawerVisible = false
          this.handleListIndexImage()
        }
      })
    },
    removePicture(id){
      pictureApi.delete(id).then(resp =>{
        if (resp.data.result === 'ok'){
          this.handleListIndexImage()
        }else {
          this.$message.warn("删除失败")
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.index-image{
  min-height: 100%;
}
.image-wrap{
  position: relative;
  width: 100%;
  height: 60vh;
  background-color: #e9e9e9;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  .image-editor{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 14%;
    background-color: rgba(0,0,0,30%);
    display: flex;
    justify-content: center;
  }
  .image-editor-item{
    display: flex;
    flex-direction: column;
    margin: .2rem .7rem;
    font-size: 3rem;
    cursor: pointer;
    color: #fff;
    span{
      font-size: 1rem;
      text-align: center;
    }
    &:hover{
      color: @primary-color;
    }
  }
}
/deep/ .slick-dots {
  height: auto;
}

/deep/ .slick-thumb {
  bottom: -45px;
}
/deep/ .slick-thumb li {
  width: 60px;
  height: 45px;
}
/deep/ .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
/deep/ .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}
</style>
