<template>

  <el-row :gutter="5" style="margin-top:5px;margin-left:5px;">
    <el-col :span="5">
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="text-align: right; ">
          <el-row :gutter="2" style="margin-top:5px; margin-left:5px;">
            <el-col :span="12" style="text-align: left; vertical-align:middle; font-size: 20px">  <span>设备分类 </span></el-col>
            <el-col :span="6"> <el-col :span="6">  <el-button type="warning" icon="el-icon-edit" size="mini" @click="jump" /></el-col>
            </el-col>
            <el-col :span="6">  <el-button type="primary" icon="el-icon-refresh" size="mini" /></el-col>
          </el-row>
        </div>
        <div class="component-item">
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="parent"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-card>
    </el-col>
    <el-col :span="19">
      <div class="app-container">
        <!--       <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="部位" name="first"><Buwei :asset-typeid="dictid" /> </el-tab-pane>
          <el-tab-pane label="点检模板" name="second"> <Dianjian :asset-typeid="dictid" /> </el-tab-pane>
          <el-tab-pane label="保养模板" name="third"> <Baoyang :asset-typeid="dictid" /></el-tab-pane>
          <el-tab-pane label="常见故障" name="fourth"><Guzhang :asset-typeid="dictid" /> </el-tab-pane>
          <el-tab-pane label="运行记录模板" name="fourth"> <Yunxing :asset-typeid="dictid" /> </el-tab-pane>
        </el-tabs> -->
        <Buwei :asset-typeid="dictid" /> <Dianjian :asset-typeid="dictid" />  <Baoyang :asset-typeid="dictid" />
        <Guzhang :asset-typeid="dictid" />  <Yunxing :asset-typeid="dictid" />
      </div>
    </el-col>
  </el-row>

</template>

<script>
import { getRecuData } from '@/api/common'
import Buwei from './components/buwei' // secondary package based on el-pagination
import Dianjian from './components/dianjian' // secondary package based on el-pagination
import Baoyang from './components/baoyang' // secondary package based on el-pagination
import Guzhang from './components/guzhang' // secondary package based on el-pagination
import Yunxing from './components/yunxing' // secondary package based on el-pagination
export default {
  name: 'Template',
  components: { Buwei, Dianjian, Baoyang, Guzhang, Yunxing },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dictid: 0,
      listLoading: true,
      getRecuListParm: { name: 'getAssetTypeList',
        idname: 'id',
        params: [-1] },
      parent: [],
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' }
    }
  },
  created() {
    this.getDownList()
  },
  methods: {
    jump() {
      this.$router.push('/console/menu')
    // 传递的参数用{{ $route.query.goodsId }}获取
    //  this.$router.push({ path: '/cart?goodsId=12' })
    // this.$router.go(-2)
    // 后退两步
    },

    handleNodeClick(data) {
      if (data.children.length === 0) {
        this.dictid = data.id
      }
    },
    getDownList() {
      getRecuData(this.getRecuListParm).then(response => {
        this.parent = response.data
      })
    }
  }
}
</script>
