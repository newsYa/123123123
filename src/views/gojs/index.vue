<template>
  <div>
    <div />
    <div class="box">
      <v-gantt-chart
        :start-time="startTime"
        :end-time="endTime"
        :datas="datas"
      >
        <template v-slot:block="{ datatset, item }">
          <!-- 你的容器块组件 -->
          <Test
            :data="datatset"
            :item="item"
          />
        </template>
        <template v-slot:left="{ data }">
          <!-- 你的行名组件 -->
          <TestLeft :data="data" />
        </template>
        <template v-slot:title>
          <!-- 你的表头组件 -->
          hola
        </template>
      </v-gantt-chart>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs"; //时间库
import Test from "./test.vue"; //你自己的gantt条容器
import TestLeft from "./test-left.vue"; //你自己的行名称组件
export default {
  name: "Gojs",
  components: {
    TestLeft,
    Test,
  },
  data() {
    return {
      datatset: [
        {
          id: "arrayOne",
          name: "sala",
          gtArray: [
            {
              name: "itemOne",
              start: "2019-01-11 18:18:18",
              end: "2019-01-11 18:18:18",
            },
          ],
          //...
        },
      ],
      startTime: dayjs().toString(), //时间轴开始时间
      endTime: dayjs().add(2, "d").add(2, "h").add(5, "s").toString(), //时间结束时间
      datas: [
        {
          id: "test", //非必须
          gtArray: [
            //默认的需要渲染的数组
            {
              name: "test", //非必须
              start: "2019-01-11 18:18:18",
              end: "2019-01-11 18:18:18",
            },
          ],
          customKey: [
            //自定义的需要渲染的数组
            {
              id: "test", //非必须
              start: "2019-01-11 18:18:18",
              end: "2019-01-11 18:18:18",
            },
          ],
        },
      ], // gantt数据
      config: {
        range: 1000 * 60 * 10,
      },
      ganttData: [
        {
          id: "0",
          text: "任务一",
          start: "2019/12/19 21:00:00",
          stop: "2019/12/19 21:10:00",
          children: [
            {
              id: "1-1",
              text: "任务1-1",
              start: "2019/12/19 21:00:00",
              stop: "2019/12/19 21:05:00",
              children: [
                {
                  id: "2-1",
                  text: "任务2-1",
                  start: "2019/12/19 21:00:00",
                  stop: "2019/12/19 21:05:00",
                },
                {
                  id: "2-2",
                  text: "任务2-2",
                  start: "2019/12/19 21:05:00",
                  stop: "2019/12/19 21:10:00",
                  children: [
                    {
                      id: "3-1",
                      text: "任务3-1",
                      start: "2019/12/19 21:00:00",
                      stop: "2019/12/19 21:05:00",
                    },
                  ],
                },
              ],
            },
            {
              id: "1-2",
              text: "任务1-2",
              start: "2019/12/19 21:05:00",
              stop: "2019/12/19 21:10:00",
            },
          ],
        },
        {
          id: "1",
          text: "任务2",
          start: "2019/12/19 21:10:00",
          stop: "2019/12/19 21:20:00",
        },
      ],
    };
  },
};
</script>
<style>
.box {
  padding: 20px;
}
</style>
