<template>
  <div>
    <!-- <model-fbx src="/static/054s1.FBX" /> -->
    <model-obj
      background-color="blue"
      src="/static/054.obj"
      
      mtl="/static/054.mtl"
    />
  </div>
</template>

<script>
import {ModelObj, ModelFbx} from 'vue-3d-model'
export default {
  components: {
    ModelObj,
    ModelFbx
  },
  data() {
    return {
      
    }
  },

}
</script>

<style>

</style>