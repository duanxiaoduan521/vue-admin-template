<template>
  <div id="chart" :style="style" />
</template>

<script>
const echarts = require('echarts')

export default {
  props: {
    view: Object
  },
  data() {
    return {
      option: this.view.option
    }
  },
  computed: {
    style() {
      return {
        width: this.view.width || '600px',
        height: this.view.height || '400px'
        // float: 'left',
      }
    }
  },
  watch: {
    options(v) {
      this.instance.setOption(v)
    }
  },
  mounted() {
    this.instance = echarts.init(this.$el)
    this.instance.setOption(this.option)
  }
}
</script>
