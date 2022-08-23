<template>
  <div style="border: 1px solid #ccc">
    <div>
      <h2 style="text-align: center">
        富文本编辑器
      </h2>
      <div class="editor">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :default-config="toolbarConfig"
          :mode="mode"
        />
        <Editor
          v-model="html"
          style="height: 500px; overflow-y: hidden"
          :default-config="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import gitMd from '../md/git.md'

export default {
  name: "Wangeditor",
  components: { Editor, Toolbar,gitMd },
  data() {
    return {
      editor: null,
      html: "<p>hello</p>",
      toolbarConfig: {},
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default", // or 'simple'
    };
  },
  created() {
    console.log(this.$isEmpty());
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = "<p>模拟 Ajax 异步设置内容 HTML</p>";
    }, 1500);
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss">
    .editor{
        margin: 10px  20px;
        border: 3px solid #000;
    }
</style>