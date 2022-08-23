import Vue from 'vue'
import echarts from 'echarts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../components/global'
import ganttYing from 'gantt-ying';
// 引入样式文件
import 'gantt-ying/lib/GanttYing.css';
// 注册为全局组件
import CodeEditor from 'bin-code-editor';
import 'bin-code-editor/lib/styles/index.css'
// 文件分片
import uploader from 'vue-simple-uploader'
/** gojs 流程图 */
import gojs from 'gojs'
import 'github-markdown-css';
Vue.config.productionTip = false // 记得改为你的路径

const isEmpty = function(e) {
  // eslint-disable-next-line
  return undefined === typeof (e) || void 0 === e || e == null || e === ''
}

import vGanttChart from 'v-gantt-chart';

Vue.use(vGanttChart);
Vue.prototype.$isEmpty = isEmpty
Vue.prototype.$echarts = echarts
Vue.prototype.go = gojs
Vue.use(ElementUI)
Vue.use(uploader)
Vue.use(CodeEditor)
Vue.use(ganttYing)

