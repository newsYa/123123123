<template>
  <div>
    <div>
      <h2 style="text-align:center">
        表格二次封装-高度自适应
      </h2>
      <td-table
        ref="tdTable"
        :columns="columns"
        :has-index="true"
        :data-source="tableData"
        :page-size="page.pageSize"
        :current-page="page.pageNum"
        :total="page.total"
        @handleSzieChange="_handleSizeChange"
        @row-click="_handleRowClick"
        @currentChange="_handleCurrentChange"
        @selection-change="_handleSelectionChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      columns: [
        {
          label: '名字',
          prop: 'name',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '描述',
          prop: 'address',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '开始时间',
          prop: 'dateS',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '结束时间',
          prop: 'end',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          label: '操作',
          showOverflowTooltip: true,
          align: 'center',
          render: (createElement, params) => {
            // console.log(params);
            return createElement('div', [
              createElement(
                'el-button',
                {
                  props: {
                    type: 'primary',
                    size: 'mini'
                  },
                  on: {
                    click: () => {
                      this.handleAdd(params)
                    }
                  }
                },
                '添加'
              ),

              createElement(
                'el-button',
                {
                  props: {
                    type: 'success',
                    size: 'mini'
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params)
                    }
                  }
                },
                '编辑'
              )
            ])
          }
        }
      ],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  created() {
    this.getqueryList()
  },
  methods: {
    handleAdd({ row }) {
      console.log(row)
    },
    handleEdit({ row }) {
      console.log(row)
    },
    getqueryList() {
      this.rq.post('data/queryList', JSON.stringify(this.page)).then((res) => {
        console.log(res)
        this.tableData = res.data.rows
        this.page.total = res.data.total
      })
    },
    _handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.page.pageNum = 1
      // 重新查询
      this.getqueryList()
    },
    _handleCurrentChange(pageNum) {
      this.page.pageNum = pageNum
      this.getqueryList()
    },
    //
    _handleRowClick(row) {
      console.log(row, 'row-click')
      // 点击选中当前行
      this.$refs.tdTable.toggleRowSelection(row)
    },
    _handleSelectionChange(arr) {
      console.log(arr, 'selection')
    }
  }
}
</script>

<style></style>
