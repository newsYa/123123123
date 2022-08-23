const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(10, 20)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }]
})

const list = [
  {
    dateS: '2016-05-02',
    end: '2016-05-02',
    name: '王小虎1',
    address: '上海市普陀区金沙江路 1518 弄'
  },
  {
    dateS: '2016-05-04',
    end: '2016-05-02',
    name: '王小虎2',
    address: '上海市普陀区金沙江路 1517 弄'
  },
  {
    dateS: '2016-05-01',
    end: '2016-05-02',
    name: '王小虎3',
    address: '上海市普陀区金沙江路 120 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎4',
    address: '上海市普陀区金沙江路 321 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎5',
    address: '上海市普陀区金沙江路 516 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎6',
    address: '上海市普陀区金沙江路 1516 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎7',
    address: '上海市普陀区金沙江路 15556 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎8',
    address: '上海市普陀区金沙江路 666 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎9',
    address: '上海市普陀区金沙江路 1516 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 222 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎4',
    address: '上海市普陀区金沙江路 777 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 333 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎13',
    address: '上海市普陀区金沙江路 444 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎14',
    address: '上海市普陀区金沙江路 1516 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎15',
    address: '上海市普陀区金沙江路 111 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎16',
    address: '上海市普陀区金沙江路 1516 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎17',
    address: '上海市普陀区金沙江路 1516 弄'
  },
  {
    dateS: '2016-05-03',
    end: '2016-05-02',
    name: '王小虎18',
    address: '上海市普陀区金沙江路 1516 弄'
  }
]
module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  },
  {
    url: '/dev/table/listPage',
    type: 'post',
    response: config => {
      var info = JSON.parse(config.body)

      var [index, size, total] = [info.pageNum, info.pageSize, list.length]

      var len = total / size

      var totalPages = len - parseInt(len) > 0 ? parseInt(len) + 1 : len
      // eslint-disable-next-line eqeqeq
      var newDataList = list.slice(index == 1 ? 0 : index * size - 10, size * index)

      return {

        'code': '0',

        'message': 'success',

        'data': {

          'pageNum': index,

          'pageSize': size,

          'rows': newDataList,

          'total': total,

          'totalPages': totalPages

        }

      }
    }
  }

]
