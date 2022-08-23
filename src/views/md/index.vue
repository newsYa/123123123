<template>
  <div>
    <div class="markdown-body">
      <git-md />
    </div>
  </div>
</template>

<script>
import gitMd from '../md/git.md'
export default {  
  name:'Md',
  components:{gitMd}

}
</script>

<style scoped>
 ::v-deep.markdown-body strong{
  color: red;
}
::v-deep.markdown-body pre{
  color: #af4c2f;
}
</style>