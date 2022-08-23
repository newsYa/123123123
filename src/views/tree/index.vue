<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="Filter keyword"
      style="margin-bottom: 30px"
    />

    <div>
      <h2 style="text-align:center">
        <a href="http://www.longstudy.club/vue-okr-tree-doc/index.html">点击查看vue-okr-tree-doc</a>
      </h2>
      <vue-okr-tree
        direction="horizontal"
        show-collapsable
        :data="data2"
        default-expand-all
        :label-class-name="renderLabelClass"
        :current-lable-class-name="renderCurrentClass"
        @node-click="treeClick"
      />
    </div>

    <div style="    margin: 0 20%;">
      <h2 style="text-align:center">
        {{ '树型穿梭框' }}
      </h2>
      <!-- // 使用树形穿梭框组件 -->
      <tree-transfer
        :title="['哈喽','word']"
        :from_data="fromData"
        :to_data="toData"
        :default-props="{label:'label'}"
        :mode="mode"
        height="540px"
        filter
        open-all
        @addBtn="add"
        @removeBtn="remove"
      />
    </div>
  </div>
</template>

<script>

import  {VueOkrTree}  from "vue-okr-tree";

import "vue-okr-tree/dist/vue-okr-tree.css";
import treeTransfer from 'el-tree-transfer'

export default {
  components:{
VueOkrTree,
treeTransfer
  },
  data() {
    return {
      filterText: '',
      data2:[{
          label: 'xxx科技有有限公司',
          content: '这是一个有活力的公司',
          children: [{
            label: '产品研发部',
            content: '这是一个有活力的产品研发部',
            children: [{
              label: '研发-前端',
              content: '这是一个有活力的研发-前端'
            }, {
              label: '研发-后端',
              ontent: '这是一个有活力的研发-后端'
            }, {
              label: 'UI 设计',
              ontent: '这是一个有活力的UI 设计'
            }]
          }, {
            label: '销售部',
            ontent: '这是一个有活力的销售部',
            children: [{
                label: '销售一部',
                ontent: '这是一个有活力的销售一部'
              },{
                label: '销售二部',
                ontent: '这是一个有活力的销售二部'
              }
            ]
          },{
            label: '财务部',
            ontent: '这是一个有活力的财务部'
          }]
        }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
        mode: "transfer", // transfer addressList
            fromData:[
              {
                id: "1",
                pid: 0,
                label: "一级 1",
                children: [
                  {
                    id: "1-1",
                    pid: "1",
                    label: "二级 1-1",
                    disabled: true,
                    children: []
                  },
                  {
                    id: "1-2",
                    pid: "1",
                    label: "二级 1-2",
                    children: [
                      {
                        id: "1-2-1",
                        pid: "1-2",
                        children: [],
                        label: "二级 1-2-1"
                      },
                      {
                        id: "1-2-2",
                        pid: "1-2",
                        children: [],
                        label: "二级 1-2-2"
                      }
                    ]
                  }
                ]
              },
            ],
            toData:[]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
      // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
          changeMode() {
            if (this.mode == "transfer") {
              this.mode = "addressList";
            } else {
              this.mode = "transfer";
            }
          },
          // 监听穿梭框组件添加
          add(fromData,toData,obj){
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
            console.log("obj:", obj);
          },
          // 监听穿梭框组件移除
          remove(fromData,toData,obj){
            // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
            // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
            console.log("fromData:", fromData);
            console.log("toData:", toData);
            console.log("obj:", obj);
          },
     renderLabelClass (node) {
        return 'label-class-blue'
      },
      renderCurrentClass (node) {
        return 'label-bg-blue'
      },
    treeClick(data,ev,node){
      console.log(data,ev,node);
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>
<style lang="scss">
.label-class-blue {
  color: #1989fa;
}
.label-bg-blue {
  background: #1989fa;
  color: #fff;
}
</style>
