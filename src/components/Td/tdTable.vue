<template>
  <div
    v-if="permissionsShow"
    :id="tableId"
    class="tdtable"
  >
    <el-row style="margin-top:0px;">
      <!-- border 显示表格线 -->
      <!-- v-loading.iTable 是否显示加载动画 -->
      <!-- header-cell-style 表头样式设置 -->
      <!-- tableHeight 表格高度设置 只接受number  -->
      <el-table
        v-if="activeTable === true"
        :ref="tablesRef"
        v-loading="hasLoading"
        border
        :stripe="stripe"
        :data="formatData"
        :height="tableHeight"
        :show-header="showHeader"
        :highlight-current-row="highlightCurrentRow"
        :row-key="rowKey"
        :max-height="maxHeight"
        :empty-text="emptyText"
        :default-expand-all="defaultExpandAll"
        :expand-row-keys="expandRowKeys"
        :show-summary="showSummary"
        :sum-text="sumText"
        :summary-method="summaryMethod"
        :span-method="spanMethod"
        :select-on-indeterminate="selectOnIndeterminate"
        :fit="fit"
        :row-class-name="rowClassName ? rowClassName : defaultRowClassName"
        :cell-class-name="cellClassName"
        :cell-style="cellStyle"
        :header-row-class-name="headerRowClassName ? headerRowClassName : titleRowClassName"
        :header-row-style="headerRowStyle"
        :header-cell-class-name="headerCellClassName"
        :tree-props="treeProps"
        class="tree-table"
        @row-click="_handRowClick"
        @row-dblclick="_handRowDblclick"
        @select="_handleSelect"
        @select-all="_handleSelectAll"
        @selection-change="_handSelectionChange"
        @cell-mouse-enter="_handCellMouseEnter"
        @cell-mouse-leave="_handCellMouseLeave"
        @cell-click="_handCellClick"
        @cell-dblclick="_handCellDblclick"
        @row-contextmenu="_handRowContextmenu"
        @header-click="_handHeaderClick"
        @header-contextmenu="_handHeaderContextmenu"
        @header-dragend="_handHeaderDragend"
        @expand-change="_handExpandChange"
        @current-change="_handCurrentChange"
        @sort-change="_handsortChange"
        @filter-change="_handfilterChange"
      >
        <!--region 选择框-->
        <el-table-column
          v-if="hasMutiSelect"
          type="selection"
          width="40"
          :selectable="selectable"
        />
        <!-- region 序号 -->
        <!--序号-->
        <el-table-column
          v-if="hasIndex && !hasTreeTable"
          align="center"
          type="index"
          width="55"
          :label="tabHead"
        />
        <slot />
        <!--主体部分-->
        <!-- 对于width属性不设置默认均分各列，可对某些进行宽度设置，其余各列均分，支持number -->
        <el-table-column
          v-for="(column, index) in showColumns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :width="column.tableWidth"
          :type="column.type"
          :column-key="column.columnKey"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :sort-method="column.sortMethod"
          :sort-by="column.sortBy"
          :sort-orders="column.sortOrders"
          :resizable="column.resizable"
          :formatter="column.formatter"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :header-align="column.headerAlign"
          :class-name="column.className"
          :label-class-name="column.labelClassName"
          :selectable="column.selectable"
          :reserve-selection="column.reserveSelection"
          :filters="column.filters"
          :filter-placement="column.filterPlacement"
          :filter-multiple="column.filterMultiple"
          :filter-method="column.filterMethod"
          :filtered-value="column.filteredValue"
          :render-header="column.renderHeader"
        >
          <!-- 操作栏相关按钮处理 -->
          <template slot-scope="scope">
            <my-render
              v-if="column.render"
              :row="scope.row"
              :render="column.render"
              :index="index"
            />
            <!-- 表格列是否可编辑 -->
            <template v-else-if="column.inputable">
              <td-input
                v-model="scope.row[column.prop]"
                :width="column.tableWidth"
              />
            </template>
            <template v-else>
              {{ scope.row[column.prop] }}
            </template>
          </template>
        </el-table-column>
        <slot name="behind" />
        <template name="append">
          <slot name="append" />
        </template>
      </el-table>
    </el-row>
    <!-- 分页信息 默认显示分页 -->
    <el-row
      v-if="hasPage"
      style="padding-top:10px;"
    >
      <!--  小型分页 只包含包括翻页功能 适用于空间较小的情况-->
      <el-col
        v-if="simplePage"
        align="center"
      >
        <el-pagination
          :small="smallPage"
          :layout="layout"
          :pager-count="smallPagerCount"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @current-change="_currentChange"
        />
      </el-col>
      <!-- 正常分页 包括背景 总页数 分页跳转功能 -->
      <el-col
        v-else
        align="center"
      >
        <el-pagination
          background
          :pager-count="smallPagerCount"
          :small="smallPage"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :layout="layout"
          :total="total"
          @size-change="_handleSizeChange"
          @current-change="_currentChange"
          @onmouseover="_onmouseover"
        />
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import MyRender from './MyRender';
import Sortable from 'sortablejs'
import { setTimeout } from 'timers'
export default {
  /* 引用渲染函数 */
  // components: { MyRender },
  components: {
    MyRender: {
      functional: true,
      props: {
        row: Object,
        render: Function
      },
      render: (h, ctx) => {
        const params = {
          row: ctx.props.row,
          index: ctx.props.index
        }
        if (ctx.props.column) params.column = ctx.props.column
        return ctx.props.render(h, params)
      }
    }
  },
  /* 接受父组件参数 */
  props: {
    /* 简单分页时，最大页码按钮数 */
    smallPagerCount: {
      type: Number,
      default: function() {
        return 7
      }
    },
    /* 是否加载动画 */
    hasLoading: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    // 将某一行多选设置为不可选择状态
    // eslint-disable-next-line vue/require-default-prop
    selectable: Function,
    /* 是否为树形表格 */
    hasTreeTable: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    /* 是否为斑马纹 */
    stripe: {
      type: Boolean,
      default: function() {
        // if (this.hasTreeTable) {
        //     return false;
        // } else {
        return true
        // }
      }
    },
    /* 是否加载多选框 */
    hasMutiSelect: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    /* 是否加载序号列 */
    hasIndex: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    /*  表格高度 */
    // eslint-disable-next-line vue/require-default-prop
    height: {
      type: [Number, String]
    },
    /* 是否加载分页 */
    hasPage: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    /* 是否使用简单分页（侧重功能） */
    simplePage: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    /* 是否使用mini分页 （侧重尺寸） */
    smallPage: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    /* 分页情况 */
    pageSizes: {
      type: Array,
      default: function() {
        return [10, 30, 50, 100]
      }
    },
    /* 接收列数据信息 包括prop/label/width  */
    /* 对应操作栏信息 采用render渲染函数接受数据，由于版本要求只接收vNode数据 */
    /* render渲染函数使用示例
                                render: (createElement, params) => {
                                        return createElement('div', [createElement('el-button', {
                                            props: { type: 'text',size: 'small'},
                                            on: {click: () => {this.exit(params.row);}}
                                            }, '编辑')
                                        ])
                                    }
                            */
    columns: {
      type: Array,
      default: () => []
    },
    /* 表格数据源 表格主题数据 */
    dataSource: {
      type: [Array, Object],
      default: function() {
        return []
      }
    },
    /*  每页条数 */
    pageSize: {
      type: Number,
      default: function() {
        return 10
      }
    },
    /* 当前页 */
    currentPage: {
      type: Number,
      default: function() {
        return 1
      }
    },
    /* 总条数 */
    total: {
      type: Number,
      default: function() {
        return 0
      }
    },
    /* 数据源子数组名称 */
    childrenName: {
      type: String,
      default: function() {
        return 'children'
      }
    },
    // eslint-disable-next-line vue/require-default-prop
    evalFunc: Function,
    // eslint-disable-next-line vue/require-default-prop
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    },
    /* 是否显示表头 */
    showHeader: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    /* 是否要高亮当前行 */
    highlightCurrentRow: {
      type: Boolean,
      default: function() {
        return true
      }
    },
    /* 是否支持行拖拽 */
    hasDraggable: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    /* 唯一行标示，在进行表格拖拽时必填属性 */
        // eslint-disable-next-line vue/require-default-prop
    rowKey: [String, Function],
    /* 是否开启翻页记忆 */
    hasPageMemory: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    /* Table 的最大高度 */
        // eslint-disable-next-line vue/require-default-prop
    maxHeight: [String, Number],
    /* 在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行 默认true */
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    /* 合并行或列的计算方法,Function({ row, column, rowIndex, columnIndex })  */
        // eslint-disable-next-line vue/require-default-prop
    spanMethod: Function,
    /* 自定义的合计计算方法 Function({ columns, data }) */
        // eslint-disable-next-line vue/require-default-prop
    summaryMethod: Function,
    /* 合计行第一列的文本 默认合计 */
        // eslint-disable-next-line vue/require-default-prop
    sumText: String,
    /* 是否在表尾显示合计行 false */
    showSummary: Boolean,
    /* 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。 */
        // eslint-disable-next-line vue/require-default-prop
    expandRowKeys: Array,
    /* 是否默认展开所有行，当 Table 中存在 type="expand" 的 Column 的时候有效 */
    defaultExpandAll: Boolean,
    /* 空数据时显示的文本内容，也可以通过 slot="empty" 设置 */
        // eslint-disable-next-line vue/require-default-prop
    emptyText: String,
    /* 列的宽度是否自撑开 */
    fit: {
      type: Boolean,
      default: true
    },
    /* 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。 */
    // eslint-disable-next-line vue/require-default-prop
    rowClassName: [String, Function],
    /* 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className */
    // eslint-disable-next-line vue/require-default-prop
    cellClassName: [String, Function],
    /* 单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style */
    // eslint-disable-next-line vue/require-default-prop
    cellStyle: [Object, Function],

    /* 表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className */
        // eslint-disable-next-line vue/require-default-prop
    headerRowClassName: [String, Function],
    /* 表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style */
        // eslint-disable-next-line vue/require-default-prop
    headerRowStyle: [Object, Function],
    /* 表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className */
    // headerCellClassName: [String, Function],
        // eslint-disable-next-line vue/require-default-prop
    rowStyle: [String, Function],
    /* 渲染嵌套数据的配置选项 */
        // eslint-disable-next-line vue/require-default-prop
    treeProps: Object,
    /* 所有权限信息 */
    permissions: {
      type: Array,
      default: function() {
        return []
      }
    },
    /* 角色信息 */
    roles: {
      type: Array,
      default: function() {
        return []
      }
    },
    /* 权限之一 */
    oneOfPermissions: {
      type: Array,
      default: function() {
        return []
      }
    },
    /** 自定义分页组件布局 */
    layout: {
      type: String,
      default: function() {
        if (this.simplePage) {
          return 'prev, pager, next'
        } else {
          return 'total, sizes, prev, pager, next, jumper'
        }
      }
    }
  },
  data() {
    return {
      test: true,
      tabHead: '序号',
      sortable: null,
      /* 是否满足显示权限 */
      permissionsShow: true,
      tableHeight: 0, // 表格高度
      tableId: 'tableId',
      tablesRef: 'tables',
      expands: [],
      multipleSelection: [], // 当前页选中的数据
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      activeTable: false,
      titleRowClassName: 'el-tableHeaderRow',
      headerCellClassName: '',
      defaultRowClassName: 'el-defaultTableRow',
      vm: window.vue,
      isSelectAll: true
    }
  },
  computed: {
    /* 计算需要展示的数据列 */
    showColumns: function() {
      const showColumns = []
      this.columns.forEach(column => {
        if (this.$isEmpty(column.showColumn) || column.showColumn) {
          showColumns.push(column)
        }
      })
      return showColumns
    },
    // 格式化数据源
    formatData: function() {
      this.clear()
      if (Math.ceil(this.total / this.pageSize) > 0 && Math.ceil(this.total / this.pageSize) < this.currentPage) {
        this.$emit('currentChange', Math.ceil(this.total / this.pageSize))
      }
      // 解决在ie浏览器表格存在滚动条的情况下，数据加载慢于表格渲染时表头与内容无法对其的问题，若版本升级源码解决此问题，该代码可删除
      if (!this.$isEmpty(this.dataSource) && this.dataSource.length > 0 && this.$refs[this.tablesRef] !== undefined) {
        this.$nextTick(() => {
          this.$refs[this.tablesRef].doLayout()
        })
      }
      // 注释结束
      return this.$isEmpty(this.dataSource) ? [] : this.dataSource
    }
  },
  watch: {
    formatData: {
      handler: function() {
        setTimeout(() => {
          this._setSelectRow()
          if (this.hasDraggable) {
            this.setSort()
          }
        }, 200)
      },
      deep: true,
      // immediate表示在watch中首次绑定的时候，是否执行handler，值为true则表示在watch中声明的时候，就立即执行handler方法，
      // 值为false，则和一般使用watch一样，在数据发生变化的时候才执行handler。
      immediate: true
    },
    columns: {
      handler: function(val) {
        this.columns = val
      },
      deep: true,
      // immediate表示在watch中首次绑定的时候，是否执行handler，值为true则表示在watch中声明的时候，就立即执行handler方法，
      // 值为false，则和一般使用watch一样，在数据发生变化的时候才执行handler。
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.sortable !== null) {
      this.sortable.destroy()
      this.sortable = null
    }

    // this.hasTreeTable = null;
    // this.dataSource = null;
    // this.evalFunc = null;
    // this._treeToArray = null;
    // this.expandAll = null;
    // this.evalArgs = null;
    // this.formatData = null;
  },
  mounted() {
    /* 生成表格id随机数 */
    for (let i = 0; i < 5; i++) {
      this.tableId += Math.floor(Math.random() * 10)
      this.tablesRef += Math.floor(Math.random() * 10)
    }
    /* 初始化表格高度 */
    window.onresize = () => {
      this._initTableHeight()
    }
    this._initTableHeight()
    this.$nextTick(function() {
      this.activeTable = true
    })
    this.headerCellClassName = 'el-headercell'
  },

  created() {
    /* 权限数据处理 */
    if (this.permissions.length > 0 || this.oneOfPermissions.length > 0 || this.roles.length > 0) {
      this.permissionsShow = this.dealPermissions(this.permissions, this.roles, this.oneOfPermissions)
    }
  },
  /* 基础方法实现 */
  methods: {
    _onmouseover(row){
      console.log(row)
      // this.style.cursor = 'pointer'
    },
    renderElement(h, ctx) {
      const params = {
        row: ctx.props.row,
        index: ctx.props.index
      }
      return ctx.props.render(h, params)
    },
    clear() {
      this.multipleSelection = []
    },
    /* 初始化表格高度 */
    _initTableHeight() {
      this.$nextTick(function() {
        if (this.height === '' || this.height === 0 || this.height === undefined) {
          if (this.$isEmpty(document.getElementById(this.tableId))) {
            console.info('table 获取node节点为null')
            return
          }
          let domNode = document.getElementById(this.tableId).parentNode.children
          let startCalculation = false
          let bottom = window.tdTableBottom ? window.tdTableBottom : 0
          for (let i = 0; i < domNode.length; i++) {
            if (startCalculation) {
              bottom +=
                                domNode[i].clientHeight +
                                parseInt(window.getComputedStyle(domNode[i], null)['marginTop'].split('px')[0]) +
                                parseInt(window.getComputedStyle(domNode[i], null)['paddingTop'].split('px')[0])
            }
            if (domNode[i].id.indexOf('tableId') >= 0) {
              startCalculation = true
            }
          }
          /* 默认为页面高度减去表格上方元素的高度和下方元素高度  */

          let hasPageHeight = 21
          if (this.hasPage) {
            // 分页的高度
            hasPageHeight = 76
          }
          this.tableHeight = window.innerHeight - document.getElementById(this.tableId).getBoundingClientRect().top - bottom - hasPageHeight
          domNode = null
        } else {
          this.tableHeight = this.height
        }
      })
    },
    /* 表头样式设置 */
    // eslint-disable-next-line no-unused-vars
    _headerStyle({ row, column, rowIndex, columnIndex }) {
      // 设置表格第一行的格式
      if (rowIndex === 0) {
        if (this.$store.state.skin === 'skinOne') {
          return 'font-weight:normal;text-align:center;color:#333333;background-color:#e3e3e3'
        } else {
          return 'font-weight:normal;text-align:center;background-color:#123681'
        }
      }
      return ''
    },
    /* 当前页改变时触发的事件 */
    /* 父组件通过绑定该事件进行参数传递
                        如：v-on:currentChange="currentChange1" currentChange对应部件方法部件方法名，currentChange1为父组件对应方法名 */
    _currentChange(val) {
      if (this.pageSize * (val - 1) < this.total) {
        this._setSelectRow()
        this.$emit('currentChange', val)
      }
    },
    /* 每页条数改变时时触发的事件 */
    _handleSizeChange(val) {
      this._setSelectRow()
      this.$emit('handleSizeChange', val)
    },
    /* 选择后实时回调父组件，selection所有选择行信息，row最新选中行信息 */
    _handleSelect(selection, row) {
      const children = this.$isEmpty(this.treeProps) ? row.children : this.$isEmpty(this.treeProps.children) ? row.children : row[this.treeProps.children]
      if (!this.$isEmpty(children) && children.length > 0) {
        const nowSelect = []
        nowSelect.push(row)
        nowSelect.push.apply(nowSelect, this.getSelection(children))
        let i = 0
        nowSelect.forEach(data => {
          const index = this.multipleSelection.indexOf(data)
          if (index === -1) {
            i = i + 1
          } else {
            this.multipleSelection.splice(index, 1)
          }
        })
        if (i > 0) {
          this.multipleSelection.push.apply(this.multipleSelection, nowSelect)
        }
      } else {
        this.multipleSelection = selection
      }
      this.$refs[this.tablesRef].clearSelection()
      selection = this.multipleSelection
      if (!this.$isEmpty(selection) && selection.length > 0) {
        selection.forEach(data => {
          this.$refs[this.tablesRef].toggleRowSelection(data, true)
        })
        this.isSelectAll = false
      } else {
        this.isSelectAll = true
      }
      this._changePageCoreRecordData()
      this.$emit('handleSelect', selection, row)
      console.log('_handleSelect', selection)
    },
    /* 选择后实时回调父组件，selection所有选择行信息 */
    _handleSelectAll(selection) {
      if (this.isSelectAll || this.multipleSelection.length === 0) {
        this.isSelectAll = false
        selection = this.getSelection(selection)
        selection.forEach(data => {
          this.$refs[this.tablesRef].toggleRowSelection(data, true)
          this.multipleSelection.push(data)
        })
      } else {
        this.isSelectAll = true
        this.$refs[this.tablesRef].clearSelection()
        this.multipleSelection = []
        selection = []
      }

      this.multipleSelection = selection
      this._changePageCoreRecordData()
      this.$emit('handleSelectAll', selection)
      console.log('_handleSelectAll', selection)
    },
    // 获取选中的值
    getSelection(data) {
      const selection = []
      if (!this.$isEmpty(data)) {
        selection.push.apply(selection, data)
        data.forEach(rows => {
          const children = this.$isEmpty(this.treeProps) ? rows.children : this.$isEmpty(this.treeProps.children) ? rows.children : rows[this.treeProps.children]
          selection.push.apply(selection, this.getSelection(children))
        })
      }
      return Array.from(new Set(selection))
    },
    /* 当选择项发生变化时会触发该事件 */
    _handSelectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    /* 当单元格 hover 进入时会触发该事件 */
    _handCellMouseEnter(row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    /* 当单元格 hover 退出时会触发该事件 */
    _handCellMouseLeave(row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    /* 当某个单元格被点击时会触发该事件 */
    _handCellClick(row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    /* 当某个单元格被双击击时会触发该事件 */
    _handCellDblclick(row, column, cell, event) {
      this.$emit('cell-dblclick', row, column, cell, event)
    },
    /* 当某一行被鼠标右键点击时会触发该事件 */
    _handRowContextmenu(row, event) {
      this.$emit('row-contextmenu', row, event)
    },
    /* 当某一行被点击时会触发该事件 */
    _handRowClick(row, event, column) {
      this.$emit('row-click', row, event, column)
    },
    /* 当某一行被双击时会触发该事件 */
    _handRowDblclick(row, even) {
      this.$emit('row-dblclick', row, even)
    },
    /* 当某一列的表头被点击时会触发该事件 */
    _handHeaderClick(column, event) {
      this.$emit('header-click', column, event)
    },
    /* 当某一列的表头被鼠标右键点击时触发该事件 */
    _handHeaderContextmenu(column, event) {
      this.$emit('header-contextmenu', column, event)
    },
    /* 当表格的当前行发生变化的时候会触发该事件 */
    _handCurrentChange(currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    /* 当表格的排序条件发生变化的时候会触发该事件 */
    _handsortChange(val) {
      this.$emit('sort-change', val)
    },
    /* 当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组 */
    _handfilterChange(filters) {
      this.$emit('filter-change', filters)
    },
    /* 当拖动表头改变了列的宽度的时候会触发该事件 */
    _handHeaderDragend(newWidth, oldWidth, column, event) {
      this.$emit('header-dragend', newWidth, oldWidth, column, event)
    },
    /* 当用户对某一行展开或者关闭的时候会触发该事件 */
    _handExpandChange(row, expandedRows) {
      this.$emit('expand-change', row, expandedRows)
    },
    // 行拖拽
    setSort() {
      if (this.sortable != null) {
        this.sortable.destroy()
      }

      const _this = this
      const el = document.querySelectorAll('.tree-table .el-table__body-wrapper > table > tbody')
      this.sortable = Sortable.create(el[el.length - 1], {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          // for show the changes, you can delete in you code
          const tempIndex = this.formatData.splice(evt.oldIndex, 1)[0]
          _this.formatData.splice(evt.newIndex, 0, tempIndex)
          _this.$emit('getSortData', evt.oldIndex, evt.newIndex, _this.formatData)
        }
      })
    },
    // 设置回显数据并回显
    setMultipleSelectionAll(feedBackList) {
      this.multipleSelectionAll = feedBackList
      this._setSelectRow()
    },
    // 设置选中的方法
    _setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0 || !this.hasPageMemory) {
        return
      }
      this.backSelectionList = this.multipleSelectionAll
      // 标识当前行的唯一键的名称
      const rowKey = this.rowKey
      const selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[rowKey])
      })
      this.$refs[this.tablesRef].clearSelection()
      for (let i = 0; i < this.formatData.length; i++) {
        if (selectAllIds.indexOf(this.formatData[i][rowKey]) >= 0) {
          this.$refs[this.tablesRef].toggleRowSelection(this.formatData[i], true)
        }
      }
    },
    // 记忆选择核心方法
    _changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      const rowKey = this.rowKey
      const that = this
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection
        return
      }
      // 总选择里面的key集合
      const selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        if (row[rowKey]) {
          selectAllIds.push(row[rowKey])
        }
      })
      const selectIds = []
      // 获取当前页选中的id
      that.multipleSelection.forEach(row => {
        selectIds.push(row[rowKey])
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[rowKey]) < 0 && row[rowKey]) {
          that.multipleSelectionAll.push(row)
        }
      })
      const noSelectIds = []
      // 得到当前页没有选中的id
      that.formatData.forEach(row => {
        if (selectIds.indexOf(row[rowKey]) < 0) {
          noSelectIds.push(row[rowKey])
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][rowKey] === id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1)
              break
            }
          }
        }
      })
    },
    /* 为父组件提供所有选择的行信息 */
    getSelectAllRows() {
      if (this.hasPageMemory) {
        return this.multipleSelectionAll
      }
      return this.multipleSelection
    },
    /* 清空翻页记忆的数组 */
    clearSelectAllRows() {
      this.multipleSelectionAll = []
      this.multipleSelection = []
      this.$refs[this.tablesRef].clearSelection()
    },
    /* 用于多���表格，清空用户的选择 */
    clearSelection() {
      this.$refs[this.tablesRef].clearSelection()
      this.multipleSelection = []
      this.multipleSelectionAll = []
    },
    /* 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中） */
    toggleRowSelection(row, selected) {
      this.$refs[this.tablesRef].toggleRowSelection(row, selected)
      if (selected) {
        if (this.multipleSelection.indexOf(row) < 0) {
          this.multipleSelection.push(row)
          this.multipleSelectionAll.push(row)
          this.isSelectAll = false
        }
      } else {
        this.multipleSelection.splice(row)
        this.multipleSelectionAll.splice(row)
      }
    },
    /* 用于多选表格，切换所有行的选中状态 */
    toggleAllSelection() {
      this.$refs[this.tablesRef].toggleAllSelection()
    },
    /* 用于可展开表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开） */
    toggleRowExpansion(row, expanded) {
      this.$refs[this.tablesRef].toggleRowExpansion(row, expanded)
    },
    /* 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。 */
    setCurrentRow(row) {
      this.$refs[this.tablesRef].setCurrentRow(row)
    },
    /* 用于清空排序条件，数据会恢复成未排序的状态 */
    clearSort() {
      this.$refs[this.tablesRef].clearSort()
    },
    /* 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件 */
    clearFilter(columnKey) {
      this.$refs[this.tablesRef].clearFilter(columnKey)
    },
    doLayout() {
      this.$refs[this.tablesRef].doLayout()
    },
    /* 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序 */
    sort(prop, order) {
      this.$refs[this.tablesRef].sort(prop, order)
    }
  }
}
</script>
<style>
.el-table td,
.el-table th {
    padding: 0px 0 !important;
    height: 35px !important;
}
.tree-table .el-table__body-wrapper {
    overflow-y: auto;
}
</style>
<style scoped>
.ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
}
.ms-tree-space::before {
    content: '';
}
.processContainer {
    width: 100%;
    height: 100%;
}
table td {
    line-height: 26px;
}
.tree-ctrl {
    position: relative;
    cursor: pointer;
    color: #2196f3;
    margin-left: -18px;
}
</style>
