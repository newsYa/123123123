<template>
  <div>
    <div>
      <h2 style="text-align:center">
        {{ 'CodeMirror,支持多种语言30+主题' }}
      </h2>
      <div class="codem">
        <codemirror
          ref="myCm"
          v-model="codeModel"
          :options="cmOptions"
          @changes="onCmCodeChanges"
          @blur="onCmBlur"
          @keydown.native="onKeyDown"
          @mousedown.native="onMouseDown"
          @paste.native="OnPaste"
        />
      </div>

      <div>
        <h2 style="text-align:center">
          {{ 'b-code-editor,针对JSON' }}
        </h2>
        <json-editor />
      </div>
    </div>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";


import "codemirror/lib/codemirror.css"
import "codemirror/theme/lucario.css"

import 'codemirror/keymap/sublime'
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/htmlmixed/htmlmixed.js";
require("codemirror/mode/vue/vue.js");
require("codemirror/mode/python/python.js");
import "codemirror/mode/css/css.js";
import "codemirror/mode/yaml/yaml.js";



import "codemirror/mode/markdown/markdown.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/hint/xml-hint.js";
import "codemirror/addon/hint/css-hint.js";
import "codemirror/addon/hint/html-hint.js";
import "codemirror/addon/hint/sql-hint.js";

import jsonEditor from './components/jsonEditor.vue'
export default {
  naem: "Codemirror",
  // eslint-disable-next-line vue/no-unused-components
  components: { codemirror,jsonEditor},
  
  data() {
    return {
      codeModel: "",
      cmOptions: {
        mode:'javascript',
        theme:'lucario', //主题
        json:true,
        tabSize: 4, // tab的空格个数
        indentUnit:2, // 一个块(编辑语言中的含义)应缩进多少个空格
        autocorrect: true, // 自动更正
        spellcheck: true, // 拼写检查
        lint: true, // 检查格式
        lineNumbers: true, //是否显示行数
        lineWrapping: true, //是否自动换行
        styleActiveLine: true, //line选择是是否高亮
        keyMap: "sublime", // sublime编辑器效果
        matchBrackets: true, //括号匹配
        autoCloseBrackets: true, // 在键入时将自动关闭括号和引号
        matchTags: { bothTags: true }, // 将突出显示光标周围的标签
        foldGutter: true, // 可将对象折叠，与下面的gutters一起使用
        gutters: [
          "CodeMirror-lint-markers",
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
        ],
     /*    highlightSelectionMatches: {
          minChars: 2,
          style: "matchhighlight",
          showToken: true,
        }, */
      },
    };
  },
  created(){
    let a ={"q":"","p":false,"bs":"","csor":"0","err_no":0,"errmsg":"","g":[{"type":"his_normal","sa":"h_1","q":"jsonlint"},{"type":"his_normal","sa":"h_2","q":"jsonlint引入"},{"type":"his_normal","sa":"h_3","q":"jsonlint引入失败"},{"type":"his_normal","sa":"h_4","q":"json-lint安装"},{"type":"his_normal","sa":"h_5","q":"json-lint."},{"type":"his_normal","sa":"h_6","q":"npm官网"},{"type":"his_normal","sa":"h_7","q":"vue 如何关闭eslint检查"},{"type":"his_normal","sa":"h_8","q":"如何关闭eslint检查"},{"type":"his_normal","sa":"h_9","q":"如何关闭eslint的警告"},{"type":"his_normal","sa":"h_10","q":".eslintrc 关闭"}],"queryid":"0x1681212f73f9a45"}
    this.codeModel=JSON.stringify(a)
  },
  methods:{
    // 
      // 格式化字符串为json格式字符串
    formatStrInJson(strValue) {
      return JSON.stringify(
        JSON.parse(strValue),
        null,
        this.cmIndentUnit
      );
    },
        // eslint-disable-next-line no-unused-vars
    onCmCodeChanges(cm, _changes) {
      this.editorValue = cm.getValue();
      this.resetLint();
    },
    // 失去焦点时处理函数
        // eslint-disable-next-line no-unused-vars
    onCmBlur(cm, _event) {
      try {
        let editorValue = cm.getValue();
        if (this.cmOptions.mode === "application/json" && editorValue) {
          if (!this.enableAutoFormatJson) {
            return;
          }
          this.editorValue = this.formatStrInJson(editorValue);
        }
      } catch (e) {
        // 啥也不做
      }
    },
    // 按下键盘事件处理函数
    onKeyDown(event) {
      const keyCode = event.keyCode || event.which || event.charCode;
      const keyCombination =
          event.ctrlKey || event.altKey || event.metaKey;
      if (!keyCombination && keyCode > 64 && keyCode < 123) {
        this.$refs.myCm.codemirror.showHint({ completeSingle: false });
      }
    },
    // 按下鼠标时事件处理函数
    // eslint-disable-next-line no-unused-vars
    onMouseDown(_event) {
      this.$refs.myCm.codemirror.closeHint();
    },
    // 黏贴事件处理函数
        // eslint-disable-next-line no-unused-vars
    OnPaste(_event) {
      if (this.cmOptions.mode === "application/json") {
        try {
          this.editorValue = this.formatStrInJson(this.editorValue);
        } catch (e) {
          // 啥都不做
        }
      }
    },
       resetLint() {
      if (!this.$refs.myCm.codemirror.getValue()) {
        this.$nextTick(() => {
          this.$refs.myCm.codemirror.setOption("lint", false);
        });
        return;
      }
      this.$refs.myCm.codemirror.setOption("lint", false);
      this.$nextTick(() => {
        this.$refs.myCm.codemirror.setOption("lint", true);
      });
    },
  }
};
</script>

<style>
.codem{
  margin: 10px 30px;
}
</style>
