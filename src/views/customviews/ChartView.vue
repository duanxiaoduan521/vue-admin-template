<template>
  <pannel class="el-main">
    <el-chart
      v-for="chart in this.view.charts"
      slot="content"
      :key="chart.index"
      :view="chart"
    />
  </pannel>
</template>

<script>
import Pannel from './Pannel'
import ElChart from './elements/ElChart'
import View from './View'

export default {
  components: { ElChart, Pannel },
  extends: View,
  props: ['view']
}
</script>
