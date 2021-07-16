<template>
<div class="index-image">
  <a-carousel arrows dots-class="slick-dots slick-thumb">
    <a slot="customPaging" slot-scope="props">
      <img :src="getImgUrl(props.i)" />
    </a>
    <div v-for="item in 4" :key="item">
      <img :src="baseUrl + 'abstract0' + item + '.jpg'" />
    </div>
  </a-carousel>
</div>
</template>

<script>
const baseUrl =
    'https://raw.githubusercontent.com/vueComponent/ant-design-vue/master/components/vc-slick/assets/img/react-slick/';
export default {
  name: "IndexImageManagement",
  data(){
    return {
      baseUrl
    }
  },
  methods:{
    getImgUrl(i) {
      return `${baseUrl}abstract0${i + 1}.jpg`;
    },
  }
}
</script>

<style scoped lang="less">
/deep/ .slick-dots {
  height: auto;
}
/deep/ .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
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
