<template>
  <div class="receive-content">

    <div slot="footer" class="dialog-footer">
      <el-button
        v-if="dialogStatus==='create'"
        ref="createb"
        type="success"
        @click="createData_again()"
      >确认新增</el-button>
      <el-button type="primary" @click="dialogStatusUpdate==='create'?createData():updateData()">确认</el-button>
      <el-button @click="dialogFormVisibleUpdate = false">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RefuseSell',
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      rules: '',
      value: false,
      listLoading: true,
      dialogStatus: '',
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' },
      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getBigStockUseList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          assetNumber: '',
          assetName: '',
          pastureName: '',
          status: ''
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog-footer{text-align:right;}
</style>
