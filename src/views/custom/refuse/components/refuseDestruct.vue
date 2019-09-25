<template>
  <div class="receive-content">
    <el-form
      ref="destructTemp"
      :model="destructTemp"
      label-position="right"
      label-width="100px"
      style="width: 800px; margin-left:50px;"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="牧场" prop="assetNumber">
            <el-input ref="assetNumber" v-model="destructTemp.assetNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门" prop="assetNumber">
            <el-input ref="assetNumber" v-model="destructTemp.assetNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单号" prop="equipmentName">
            <el-input ref="equipmentName" v-model="destructTemp.equipmentName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="类型" prop="assetNumber">
            <el-input ref="assetNumber" v-model="destructTemp.assetNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格" prop="equipmentName">
            <el-input ref="equipmentName" v-model="destructTemp.equipmentName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="数量" prop="assetNumber">
            <el-input ref="assetNumber" v-model="destructTemp.assetNumber" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="单位" prop="assetNumber">
            <el-input ref="assetNumber" v-model="destructTemp.assetNumber" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="处理结果" prop="equipmentName">
            <el-radio v-model="radio" label="1">销毁</el-radio>
            <el-radio v-model="radio" label="2">卖掉</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
  name: 'RefuseDestruct',
  props: ['destructTemp'],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      rules: '',
      value: false,
      radio: '',
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
.dialog-footer {
  text-align: right;
}
</style>
