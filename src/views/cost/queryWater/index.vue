<template>
  <div class="dashboard-editor-container">

    <!-- <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row> -->
    <!-- 集团 -->
    <el-row v-if="display" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <bar-chart-group />
        </div>
      </el-col>
    </el-row>
    <!-- 牧场 -->
    <el-row v-if="display" :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <bar-chart-pasture />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarChartGroup from './components/BarChartGroup '
import BarChartPasture from './components/BarChartPasture'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    BarChartPasture,
    BarChartGroup
  },
  data() {
    return {
      display: true,
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
