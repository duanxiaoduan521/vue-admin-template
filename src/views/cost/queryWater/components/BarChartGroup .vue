<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

// eslint-disable-next-line no-unused-vars
const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '475px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // this.chart = echarts.init(this.$el, 'macarons')
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        dataset: {
          source: [
            ['product', '10月', '9月', '8月', '7月', '6月'],
            ['牧场A', 41.1, 30.4, 65.1, 53.3, 55],
            ['牧场B', 86.5, 92.1, 85.7, 83.1, 66],
            ['牧场C', 24.1, 67.2, 79.5, 86.4, 33]
          ]
        },
        xAxis: [
          { type: 'category', gridIndex: 0, name: '最近12个月' },
          { type: 'category', gridIndex: 1, name: '牧场' }
        ],
        yAxis: [
          { gridIndex: 0, name: '总费用' },
          { gridIndex: 1, name: '总费用' }
        ],
        grid: [
          { bottom: '58%' },
          { top: '58%' }
        ],
        series: [
        // These series are in the first grid.
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          // These series are in the second grid.
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 }
        ]
      })
      // 点击柱状图拿到对应内容
      this.chart.on('click', function(params) {
        console.log('单击了' + params.name + 'x轴标签')
        if (params.name === '10月') {
          alert('这是10月的内容')
        }
      })
    }
  }
}
</script>
