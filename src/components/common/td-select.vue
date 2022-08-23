<!--
 TreeSelect.vue组件
 -->
<!--
 * @Author: chengqiruo
 * @Date: 2021年5月10日 14:18:10
 * @LastEditors: 程其若/chengqiruo
 * @LastEditTime: 2021年5月10日 14:18:13
 * @Description: 树型选择
 * @Email: 1057161736@qq.com
 * @Company: 3xData
 * @youWant: nothing
 -->
<template>
  <el-popover
    v-model="visible"
    :width="width"
    trigger="manual"
    placement="bottom-start"
  >
    <!-- 多选 -->
    <div
      v-if="!oneNode"
      slot="reference"
      ref="el_input"
    >
      <!-- 同步加载 -->
      <template v-if="typesRender">
        <!-- 同步多选 -->
        <div
          ref="multiple"
          class="multiple"
          :style="{
            'min-height': minHeight + 'px',
            'border-color': disabled
              ? '#C0C4CC'
              : visible
                ? '#409EFF'
                : '#C0C4CC',
            'margin-top': '2px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            'background-color': disabled
              ? 'rgb(245,247,250)'
              : 'rgb(255,255,255)',
          }"
          @click.stop="
            () => {
              if (!disabled) {
                visible = true;
              }
            }
          "
          @mouseenter="el_inputMouseEnter"
          @mouseleave="el_inputMouseLeave"
        >
          <div style="width: 90%">
            <div
              v-show="defaultValue.length == 0"
              class="placeholder"
              :style="{
                'font-size': fontSize + 'px',
                'line-height': minHeight + 2 + 'px',
              }"
            >
              {{ showPlaceholder }}
            </div>
            <span
              v-for="(item, index) in defaultValue"
              :key="'oneNode' + index"
              class="chooseItems"
            >
              {{ lazy ? item[optionsProps.label] : chooseItem(item) }}
              <i
                v-if="!disabled"
                class="el-icon-error"
                @click.stop="delItems(item)"
              />
            </span>
          </div>
          <span
            v-if="!disabled"
            style="
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              display: flex;
            "
          >
            <i
              class="el-icon-circle-close"
              :style="{
                visibility: multipleClear ? 'unset' : 'hidden',
              }"
              @click.stop="multipleClearable"
            />
            <i
              ref="arrowDown"
              class="el-icon-arrow-down"
            />
          </span>
        </div>
      </template>
    </div>
    <!-- 单选 -->
    <template v-if="typesRender">
      <div
        v-if="oneNode"
        slot="reference"
        ref="el_input"
        class="el_input"
        @click.stop="inputClick"
        @mouseenter="el_inputMouseEnter"
        @mouseleave="el_inputMouseLeave"
      >
        <el-input
          v-model="value"
          :size="size"
          :placeholder="showPlaceholder"
          clearable
          :disabled="disabled"
          readonly
          @focus="focus"
          @blur="blur"
        >
          <span
            slot="suffix"
            style="
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              display: flex;
            "
          >
            <i
              v-if="clearable"
              class="toolIcon el-icon-circle-close"
              :style="{
                visibility: closeShow ? 'unset' : 'hidden',
              }"
              @click="clearAble"
            />
            <i
              ref="arrowDown"
              class="el-icon-arrow-down"
            />
          </span>
        </el-input>
      </div>
    </template>
    <div class="tree-model">
      <el-form :size="size">
        <el-form-item>
          <el-input
            v-model="searchValue"
            placeholder="请输入搜索内容"
            type="text"
            clearable
            @keyup.enter.native="queryNode"
            @clear="queryNode"
          >
            <el-button
              slot="append"
              type="default"
              icon="el-icon-search"
              @click="queryNode"
            />
          </el-input>
        </el-form-item>
      </el-form>
      <div
        class="treeBox"
        :style="{
          'max-height': maxHeight + 'px',
        }"
      >
        <template v-if="!lazy">
          <el-tree
            ref="tree"
            :data="sourceTree"
            :show-checkbox="!oneNode"
            :node-key="optionsProps.value"
            :default-expanded-keys="defaultExpandedKeys"
            :current-node-key="currentNodeKey"
            :default-checked-keys="defaultCheckedKey"
            :filter-node-method="filterNode"
            :props="optionsProps"
            :highlight-current="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            :indent="8"
            @node-click="handleNodeClick"
            @check="checkClick"
          >
            <template slot-scope="{ node, data }">
              <slot :row="{ node, data }">
                <span>
                  {{ node.label }}
                  <span
                    v-if="
                      data.children &&
                        data.children.length > 0 &&
                        optionsProps.showCount
                    "
                    style="color: #909399; font-size: 12px"
                  >({{ data.children.length }})</span>
                </span>
              </slot>
            </template>
          </el-tree>
        </template>
        <!-- 懒加载树 -->
        <template v-else>
          <el-tree
            v-if="lazyTreeReload"
            ref="tree"
            v-loading="lazyLoading"
            :show-checkbox="!oneNode"
            :node-key="optionsProps.value"
            :current-node-key="currentNodeKey"
            :default-checked-keys="defaultCheckedKey"
            :props="optionsProps"
            :highlight-current="true"
            :expand-on-click-node="false"
            :check-on-click-node="true"
            :indent="8"
            lazy
            :load="loadNode"
            @node-click="handleNodeClick"
            @check="checkClick"
          >
            <template slot-scope="{ node, data }">
              <slot :row="{ node, data }">
                <span>
                  {{ node.label }}
                  <span
                    v-if="
                      data.children &&
                        data.children.length > 0 &&
                        optionsProps.showCount
                    "
                    style="color: #909399; font-size: 12px"
                  >({{ data.children.length }})</span>
                </span>
              </slot>
            </template>
          </el-tree>
        </template>
      </div>
    </div>
  </el-popover>
<!--   <TreeSelect
      :disabled="false"
      :treeData="treeData"
      :defaultValue="queryForm.value"
      :oneNode="true"
      @change="handleChange"
      :optionsProps="{
        value: 'value',
        label: 'label',
        children: 'children',
        showCount: true,
       }"
       placeholder="选项"
       ref="selectTree"
       size='small'
     >
     	 <template slot-scope="scoped">
        {{scoped.row.data.label}}
      </template> 
     </TreeSelect> -->
</template>

<script>
/* 触发表单验证 事件：blur
Attributes:
	clearable:Boolean (显示清空按钮)
	showAllLevels: Boolean (是否显示完整路径)
	maxHeight: Number|String (树组件 最大高)
	disabled:Boolean （是否禁用）
	treeData: Array  ( 树形数据源 )
	defaultValue: String|Number (默认选中数据)
	oneNode:Boolean (是否单选多选)
	optionsProps:Object {
		value:String (选项值)
		label:String (显示值)
		children:Array ( 子集 )
		showCount:Boolean (是否显示子集数量)
	}（选项配置）
	placeholder:String ( 显示框文字 )
	size:String (组件大小：large | medium | small | mini)
Events:
	change：选项值改变，参数（value）
Methods:
	reset : 重置选项数据，清空选中，eg:this.$refs.treeSelect.reset("") */

// import { removeChildren, findPathByLeafId } from "@/utils/index.js";

/*utils/index.js文件*/
// 去除树型数据中空children
    function removeChildren(array) {
  const temp = JSON.parse(JSON.stringify(array));
  let doSth = (arr) => {
    arr.forEach((item) => {
      if (item.children && item.children.length == 0) {
        delete item.children
      }
      if (item.children && item.children.length > 0) {
        doSth(item.children)
      }
    })
  }
  doSth(temp);
  doSth = null; //解除对doSth的引用 释放内存
  return temp
}
/*
json 树根据自定溯源
 * @param {*} keys:键名
 * @param {*} leafId : 搜索的id
 * @param {*} nodes : json树数据
*/
 function findPathByLeafId(keys, leafId, nodes, path) {
  let result = [];
  let findByLeadId = (keys, leafId, nodes, path) => {
    if (path === undefined) {
      path = [];
    }
    for (var i = 0; i < nodes.length; i++) {
      var tmpPath = path.concat();
      tmpPath.push({
        ...nodes[i],
        children: []
      });
      if (leafId == nodes[i][keys]) {
        return tmpPath;
      }
      if (nodes[i].children) {
        var findResult = findByLeadId(keys, leafId, nodes[i].children, tmpPath);
        if (findResult) {
          return findResult;
        }
      }
    }
  }
  result = findByLeadId(keys, leafId, nodes, path)
  findByLeadId = null; //解除对函数引用释放内存
  return result || []
}


export default {
  props: {
    maxHeight: {
      type: [Number, String],
      default: () => 250,
    },
    size: {
      type: String,
      default: () => "mini",
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: () => false,
    },
    title: {
      type: String,
      default: () => "",
    },
    // 传入内部的树型数据
    treeData: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: () => "",
    },
    // 默认传入数据，用于反选
    defaultValue: {
      type: [Array, String, Number, Object],
      default: (e) => "",
    },
    clearable: {
      type: Boolean,
      default: () => true,
    },
    /**
     * 传进来的自定义选项 id label chilren
     * eg:{
     *  value:"id",
     *  label:"label",
     *  children:"children"
     *  showCount: true, //显示条目
     * }
     *
     */
    optionsProps: {
      require: true,
      type: Object,
      default: () => {},
    },
    // 是否单选
    oneNode: {
      type: Boolean,
      default: () => true,
    },
    // 是否显示全路径
    showAllLevels: {
      type: Boolean,
      default: () => true,
    },
    lazy: {
      type: Boolean,
      default: () => false,
    },
    lazyLoading: {
      type: Boolean,
      default: () => false,
    },
    halfCheckedKeys:{
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      lazyTreeReload: true, //重载tree组件实现远程搜索
      resolveArr: [], //懒加载resolve的数组
      num: 1,
      timer: null,
      multipleClear: false,
      handleTree: [], // 做多选将数组扁平化
      closeShow: false,
      searchValue: "",
      visible: false,
      sourceTree: [],
      width: "400",
      value: "",
      valueTemp: "", //用于存取上一次的value
      currentNodeKey: "",
      defaultExpandedKeys: [], //默认展开节点 内部存id
      defaultCheckedKey: [], // 默认选中节点 内部存id
      showPlaceholder: "请选择" + this.placeholder,
    };
  },
  computed: {
    // 类型渲染
    typesRender() {
      if (this.lazy && this.oneNode) {
        if (
          Object.prototype.toString.call(this.defaultValue) !==
          "[object Object]"
        ) {
          console.error("props: defaultValue shoule be Object");
          return false;
        }
      }
      if (this.lazy && !this.oneNode) {
        if (!(this.defaultValue instanceof Array)) {
          console.error("props: defaultValue shoule be Array");
          return false;
        }
      }
      if (!this.lazy && !this.oneNode) {
        if (!(this.defaultValue instanceof Array)) {
          console.error("props: defaultValue shoule be Array");
          return false;
        }
      }
      return true;
    },
    changeData() {
      return {
        treeData: this.sourceTree,
        value: this.defaultValue,
      };
    },
    minHeight() {
      let height = 28;
      switch (this.size) {
        case "large":
          height = 38;
          break;
        case "medium":
          height = 36;
          break;
        case "small":
          height = 30;
          break;
        default:
          height = 26;
          break;
      }
      return height;
    },
    fontSize() {
      let height = 12;
      switch (this.size) {
        case "large":
          height = 18;
          break;
        case "medium":
          height = 16;
          break;
        case "small":
          height = 14;
          break;
        default:
          height = 12;
          break;
      }
      return height;
    },
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          this.$refs.arrowDown.style.transform = "rotate(-180deg)";
        } else {
          this.$refs.arrowDown.style.transform = "rotate(0)";
        }
      },
    },
    treeData: {
      immediate: true,
      deep:true,
      handler(newVal) {
        if (this.oneNode === false) {
          if (newVal.length > 0) {
            // 将树型数据拍扁
            const tree = this.handleTreeMethod(newVal);
            this.handleTree = tree;
          }
        }
        this.sourceTree = removeChildren(newVal);
        if (this.sourceTree.length > 0) {
          this.defaultExpandedKeys = [
            this.sourceTree[0][this.optionsProps.value],
          ];
        }
      },
    },
    defaultValue: {
      immediate: true,
      handler(newVal) {
        // 同步树
        if (!this.lazy) {
          // 同步选择方法
          if ((newVal == "0" || newVal) && this.sourceTree.length != 0) {
            // 单选
            if (this.oneNode) {
              this.$nextTick(() => {
                const temp = findPathByLeafId(
                  this.optionsProps.value,
                  newVal,
                  this.sourceTree
                );
                const renderStringBase =
                  temp && temp.length > 0
                    ? temp.map((item) => item[this.optionsProps.label])
                    : [];
                const renderString =
                  renderStringBase.length > 0 ? renderStringBase.join("/") : "";
                if (this.showAllLevels) {
                  this.value = renderString;
                } else {
                  this.value = [...renderStringBase].pop();
                }
                this.valueTemp = this.value;
                this.currentNodeKey = newVal;
                this.$refs.tree.setCurrentKey(this.currentNodeKey); //设置高亮
                this.defaultExpandedKeys = temp.map(
                  (item) => item[this.optionsProps.value]
                );
              });
            } else {
              // 多选
              // console.log('多选===》》》',newVal);
              this.defaultCheckedKey = newVal;
              this.defaultExpandedKeys = newVal;
              this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(newVal);
                // this.$refs.tree.getCheckedKeys()
              });
            }
          }
        }
        // 判断是否为懒加载单选第一次传入
        if (
          (newVal == "0" || newVal) &&
          this.oneNode &&
          this.lazy &&
          !this.$refs.tree &&
          newVal[this.optionsProps.value]
        ) {
          this.currentNodeKey = newVal[this.optionsProps.value];
          this.showPlaceholder = newVal[this.optionsProps.label];
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.currentNodeKey); //设置高亮
          });
        }
        // 懒加载单选后续传入值
        if (
          (newVal == "0" || newVal) &&
          this.oneNode &&
          this.lazy &&
          this.$refs.tree
        ) {
          const currentNode = this.$refs.tree.getCurrentNode();
          if (currentNode) {
            console.log(this.$refs.tree.getCurrentNode());
            this.value = currentNode.label;
          }
        }
        // 懒加载多选传入
        if ((newVal == "0" || newVal) && !this.oneNode && this.lazy) {
          this.defaultCheckedKey = newVal.map((item) => {
            return item[this.optionsProps.value];
          });
          this.$nextTick(() => {
            // this.$refs.tree.setCheckedKeys(this.defaultCheckedKey);
            this.defaultCheckedKey.forEach((item)=>{
              this.$refs.tree.setChecked(item,true)
            })
          });
        }
      },
    },
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.width = this.$refs.el_input.offsetWidth;
      window.addEventListener("resize", this.widthChange, false);
    }, 300);
    window.addEventListener("click", this.docClick, false);
  },
  beforeDestroy() {
    window.removeEventListener("click", this.docClick, false);
    window.removeEventListener("resize", this.widthChange, false);
  },

  methods: {
    chooseItem(val) {
      const that = this;
      const temp = findPathByLeafId(
        that.optionsProps.value,
        val,
        that.sourceTree
      );
      // console.log(temp);
      const renderStringBase =
        temp && temp.length > 0
          ? temp.map((item) => item[this.optionsProps.label])
          : [];
      const renderString =
        renderStringBase.length > 0 ? renderStringBase.join("/") : "--";
      if (this.showAllLevels) {
        return renderString;
      } else {
        return [...renderStringBase].pop();
      }
    },
    setResolveArr(arr) {
      this.resolveArr = arr;
    },
    // 懒加载节点
    loadNode(node, resolve) {
      this.$emit("load", { node, resolve });
    },
    setLazyTreeShow(val) {
      this.lazyTreeReload = val;
    },
    queryNode() {
      if (this.lazy) {
        this.$emit("queryNode", this.searchValue);
      } else {
        this.$refs.tree.filter(this.searchValue.trim());
      }
    },
    // 多选清空
    multipleClearable() {
      if(this.lazy){
        this.$emit("change", {
          checkedKeys:[],
          halfCheckedKeys:[]
        });
        this.dispatch("ElFormItem", "el.form.blur", [{
          checkedKeys:[],
          halfCheckedKeys:[]
        }]);
      }
      
    },
    delItems(val) {
      console.log(val);
      const temp = [...this.defaultValue];
      try {
        this.defaultValue.forEach((item, index) => {
          if (this.lazy) {
            if (item[this.optionsProps.value] == val[this.optionsProps.value]) {
              temp.splice(index, 1);
              throw item;
            }
          } else {
            if (item == val) {
              temp.splice(index, 1);
              throw item;
            }
          }
        });
      } catch (e) {}
      if(this.lazy){
        this.$emit("change", {
          checkedKeys:temp,
          halfCheckedKeys:this.halfCheckedKeys
        });
        this.dispatch("ElFormItem", "el.form.blur", [{
          checkedKeys:temp,
          halfCheckedKeys:this.halfCheckedKeys
        }]);
      }else{
        this.$emit("change", temp);
        this.dispatch("ElFormItem", "el.form.blur", [temp]);
      }
      console.log(temp);
      
      
    },
    // 递归将树拍扁
    handleTreeMethod(tree) {
      if (tree.length == 0) {
        return [];
      }
      const temp = [];
      let handle = (val) => {
        val.forEach((item, index) => {
          let obj = { ...item, children: [] };
          temp.push(obj);
          if (item.children && item.children.length > 0) {
            item.children.forEach((its) => {
              obj.children.push(its[this.optionsProps.value]);
            });
            handle(item.children);
          }
        });
      };
      handle(tree);
      handle = null;
      return temp;
    },
    el_inputMouseEnter() {
      if (this.disabled) {
        return false;
      }
      if (this.oneNode && this.value && !this.disabled) {
        this.closeShow = true;
      }
      if (!this.oneNode && this.defaultValue.length > 0) {
        this.multipleClear = true;
      }
    },
    el_inputMouseLeave() {
      if (this.disabled) {
        return false;
      }
      if (this.oneNode) {
        this.closeShow = false;
      } else {
        this.multipleClear = false;
      }
    },
    inputClick() {},
    reset(val) {
      this.value = val || "";
      this.defaultExpandedKeys = [];
      this.defaultCheckedKey = [];
      this.currentNodeKey = "";
      this.$refs.tree.setCurrentKey(null);
    },
    clearAble() {
      this.value = "";
      this.currentNodeKey = "";
      this.valueTemp = "";
      this.$refs.tree.setCurrentKey(null);
      if (this.lazy) {
        this.$emit("change", {});
        this.dispatch("ElFormItem", "el.form.blur", [{}]);
      } else {
        this.$emit("change", this.currentNodeKey);
        this.dispatch("ElFormItem", "el.form.blur", [this.currentNodeKey]);
      }
    },
    // 选中节点事件
    checkClick(data, isCheck) {
      // 异步懒加载树
      if (this.lazy) {
        // 单选
        if (this.oneNode) {
          this.$emit("change", data);
          this.visible = false;
          this.dispatch("ElFormItem", "el.form.blur", [data]);
        } else {
          // 多选
          const arr = [];
          let childs = [];
          for (let i = 0; i < this.handleTree.length; i++) {
            for (let j = 0; j < isCheck.checkedKeys.length; j++) {
              // 将选中的父节点排出
              if (
                this.handleTree[i][this.optionsProps.value] ==
                  isCheck.checkedKeys[j] &&
                this.handleTree[i].children.length > 0
              ) {
                arr.push(this.handleTree[i]);
              }
            }
          }
          // 将所有选中的父的children 排除
          arr.forEach((item) => {
            childs = childs.concat(item.children);
          });
          // 对筛选出来的子去重
          childs = Array.from(new Set(childs));
          let tempCheckedKeys = JSON.parse(JSON.stringify(isCheck.checkedKeys));
          // 两个数组取差集 选中的节点
          const lastCheck = this.arrDiff(tempCheckedKeys, childs);
          // console.log(lastCheck,this.handleTree);
          const lastCheckTemp = [];
          this.handleTree.forEach((item)=>{
            lastCheck.find((its)=>{
             if(item[this.optionsProps.value] === its){
               lastCheckTemp.push(item)
               return item
             }
           })
          })
          console.log(data,isCheck);
          let halfCheckedKeysTemp = isCheck.halfCheckedKeys.concat(this.halfCheckedKeys)
          halfCheckedKeysTemp = Array.from(new Set(halfCheckedKeysTemp));
          console.log(halfCheckedKeysTemp);
          this.$emit("change", {
            ...isCheck,
            checkedKeys:lastCheckTemp,
          });
          this.dispatch("ElFormItem", "el.form.blur", [lastCheckTemp]);
        }
      } else {
        // 同步多选
        if (!this.oneNode) {
          const arr = [];
          let childs = [];
          for (let i = 0; i < this.handleTree.length; i++) {
            for (let j = 0; j < isCheck.checkedKeys.length; j++) {
              // 将选中的父节点排出
              if (
                this.handleTree[i][this.optionsProps.value] ==
                  isCheck.checkedKeys[j] &&
                this.handleTree[i].children.length > 0
              ) {
                arr.push(this.handleTree[i]);
              }
            }
          }
          // 将所有选中的父的children 排除
          arr.forEach((item) => {
            childs = childs.concat(item.children);
          });
          // 对筛选出来的子去重
          childs = Array.from(new Set(childs));
          let tempCheckedKeys = JSON.parse(JSON.stringify(isCheck.checkedKeys));
          // 两个数组取差集 选中的节点
          const lastCheck = this.arrDiff(tempCheckedKeys, childs);
          this.$emit("change", lastCheck);
          this.dispatch("ElFormItem", "el.form.blur", [lastCheck]);
        } else {
          if (data[this.optionsProps.value] == this.currentNodeKey) {
            this.value = this.valueTemp;
          }
          this.$emit("change", data[this.optionsProps.value]);
          this.visible = false;
          this.dispatch("ElFormItem", "el.form.blur", [this.currentNodeKey]);
        }
      }
    },
    // 数组取差集
    arrDiff(arr1, arr2) {
      return arr1.filter((i) => {
        return arr2.indexOf(i) < 0;
      });
    },
    handleNodeClick(data) {},
    // 节点过滤
    filterNode(value, data) {
      if (!value) return true;
      return data[this.optionsProps.label].indexOf(value) !== -1;
    },
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;
        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    // 失去焦点的时候触发
    blur() {
      // this.value = this.valueTemp;
    },
    // 获取焦点的时候触发
    focus() {
      this.visible = true;
    },
    input(val) {
      this.debounce(() => {
        this.$refs.tree.filter(val);
      }, 1000);
    },
    // 防抖
    debounce(fn, wait) {
      const that = this;
      if (that.timer !== null) {
        clearTimeout(that.timer);
      }
      that.timer = setTimeout(fn, wait);
    },
    docClick() {
      if (this.visible) {
        this.visible = false;
      }
    },
    widthChange() {
      this.width = this.$refs.el_input.offsetWidth;
    },
  },
};
</script>

<style scoped lang="scss">
.tree-model {
  width: 100%;

  .treeBox {
    overflow: auto;
    .el-tree {
      min-width: 100%;
      display: inline-block;
    }
  }
}
.el_input {
  .el-icon-arrow-down {
    transition: 0.3s;
    margin-right: 5px;
  }
  .toolIcon {
    margin-right: 10px;
    cursor: pointer;
  }
}
// 多选下拉框
.multiple {
  border: 1px solid transparent;
  border-radius: 5px;
  transition: border-color 0.3s;
  cursor: pointer;
  position: relative;
  // 多选单项
  .chooseItems {
    display: inline-block;
    font-size: 12px;
    color: #909399;
    background-color: #f4f4f5;
    border: 1px solid #e9e9eb;
    border-radius: 3px;
    line-height: 22px;
    margin: 2px 0 2px 6px;
    padding: 0 8px;
    .el-icon-error {
      font-size: 14px;
      line-height: 22px;
      color: #a1a1a1;
      margin-left: 3px;
      &:hover {
        color: #616161;
      }
    }
  }
  .el-icon-circle-close {
    cursor: pointer;
    color: rgba(180, 188, 204);
    margin-right: 5px;
    &:hover {
      color: rgb(154, 160, 173);
    }
  }
  .placeholder {
    color: rgba(180, 188, 204, 1);
    margin-left: 15px;
    font-size: 12px;
  }
  .el-icon-arrow-down {
    color: rgba(180, 188, 204, 1);
  }
  .el-icon-arrow-down {
    margin-right: 5px;
    transition: 0.3s;
  }
  &:hover {
    border-color: rgba(180, 188, 204, 1);
  }
}
// 禁用下拉多选树
.disabledBox {
  cursor: not-allowed;
  visibility: hidden;
}
</style>
