<template>
  <div class="receive-content">
    <el-table
      :key="tableKey"
      element-loading-text="给我一点时间"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      class="elTable"
    >
      <!-- table表格 -->
      <el-table-column label="备件编码" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.useForm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备件名称" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.listType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}{{ scope.row.departmentName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="牧场" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oddNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oddNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领单编号" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oddNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应入数量" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oddNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实入数量" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oddNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oddNumber }}</span>
        </template>
      </el-table-column>
    </el-table>
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
  name: 'ReceiveOld',
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
