<template>
  <div>
    <div>
      <!--     <uploader
          :options="options"
          :file-status-text="statusText"  statusText{success:上传成功,error:'上传失败'}
          :auto-start="false"
          class="uploader-example"
          ref="uploader"
          @file-added="onFileAdded"  //添加
          @file-success="onFileSuccess"  //成功
          @file-error="onFileError" // 错误
          @file-removed="fileRemoved" //移除
        > -->
      <h2 style="text-align:center">
        适合大文件 文件夹，切片上传
      </h2>
      <uploader
        :key="uploader_key"
        ref="uploader"
        :options="options"
        :auto-start="autoStart"
        class="uploader-example"
        @file-success="onFileSuccess"
        @file-added="onFileAdded"
        @file-removed="fileRemoved"
      >
        <uploader-unsupport />
        <uploader-drop>
          <uploader-btn
            :directory="true"
            :single="true"
          >
            选择文件夹
          </uploader-btn>
        </uploader-drop>
        <uploader-list />
      </uploader>
    </div>
  </div>
</template>

<script>

/**
 *  安装：npm install vue-simple-uploader --save
 *  引入:import uploader from 'vue-simple-uploader'
 *       Vue.use(uploader)
 *  具体配置：https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md#%E9%85%8D%E7%BD%AE
 */
export default {
  name: 'Uploads',
  data() {
    return {
      autoStart: false, // 默认 true, 是否选择文件后自动开始上传。
      uploader_key: new Date().getTime(), // 这个用来刷新组件--解决不刷新页面连续上传的缓存上传数据（注：每次上传时，强制这个值进行更改---根据自己的实际情况重新赋值）
      options: {
        // chunkSize: 204800, //分块大小
        singleFile: false, // 单条文件上传，会顶替之前上传的 默认false
        target: '/uploadCategory', // SpringBoot后台接收文件夹数据的接口
        testChunks: true, // 是否分片-不分片  （多/大文件使用）
        fileParameterName: 'file', // 上传文件时文件的参数名，默认file
        maxChunkRetries: 3, // 最大自动失败重试上传次数
        simultaneousUploads: 3 // 并发上传数，默认 3。
      }
    }
  },
  methods: {
    // 清除缓存
    clearcache() {
      this.$refs.uploader.uploader.cancel()
    },
    onFileAdded: function(file) {
      console.log(file)
      this.$nextTick(() => {
        console.log(this.$refs['uploader'].files.length)
      })
    },
    fileRemoved: function(file) {
      console.log(file)

      this.$nextTick(() => {
        console.log(this.$refs.uploader.uploader)
      })
    },
    onFileSuccess: function(rootFile, file, response, chunk) {
      console.log(rootFile, 'rootFile')
      console.log(file, 'wenjian')
      console.log(response, 'res')
      console.log(chunk, 'chunk')
      // 这里可以根据response（接口）返回的数据处理自己的实际问题（如：从response拿到后台返回的想要的数据进行组装并显示）
      // 注，这里从文件夹每上传成功一个文件会调用一次这个方法
    }
  }
}
</script>
<style>
.uploader-example {
  width: 90%;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.uploader-example .uploader-btn {
  margin-right: 4px;
}

.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
