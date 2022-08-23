<template>
  <div id="viewer"></div>
</template>
<script>
import {Viewer} from 'photo-sphere-viewer' // 引入组件
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css' // 引入样式
export default {
  data(){
    return{
      viewer:'', // 声明一个视图对象，以便后期全局进行组件的操作
      imgurl1:require('../../assets/404_images/wallhaven-zxlrqg.jpg'), // 全景图的图片
    }
  },
  mounted(){
    this.viewer = new Viewer({
      // （必需的） 将包含全景图或元素标识符的 HTML 元素
      container:document.querySelector('#viewer'),
      // （必需的） 全景路径。必须是默认 equirectangular 适配器的单个 URL。其他适配器支持其他值。
      // photo-sphere-viewer支持多种适配器，这里讲到的是默认的 equirectangular 适配器，使用起来最为简单，但是要求图片必须为全景图
      panorama: this.imgurl1,
      // 这里定义展示视图的大小，也可以通过CSS在样式中定义
      size:{
        width: '80vw',
        height: '80vh',
      },
    });
  }
}

</script>
