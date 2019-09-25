<template>
  <div class="receive-content">
    <el-form
      ref="repairwTemp"
      :model="repairwTemp"
      label-position="right"
      label-width="100px"
      style="width: 800px; margin-left:50px;"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="牧场设备编号" prop="stockNumber">
            <el-input ref="stockNumber" v-model="temp.stockNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="牧场名称" prop="stockName">
            <el-input ref="stockName" v-model="temp.stockName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="牧场设备编号" prop="stockNumber">
            <el-input ref="stockNumber" v-model="temp.stockNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资产名称" prop="stockName">
            <el-input ref="stockName" v-model="temp.stockName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="故障现象" prop="stockNumber">
            <el-input ref="stockNumber" v-model="temp.stockNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="报修图片" prop="stockName">
            <el-input ref="stockName" v-model="temp.stockName" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="部门" prop="stockNumber">
            <el-input ref="stockNumber" v-model="temp.stockNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="操作" prop="stockName">
            <el-select
              v-model="getdataListParm.parammaps.auditStatue"
              clearable
              placeholder="操作"
              class="filter-item"
            >
              <el-option
                v-for="item in getDictByNameA"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="故障详情" prop="stockNumber">
            <el-input ref="stockNumber" v-model="temp.stockNumber" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="处理结果" prop="stockNumber">
            <el-radio-group v-model="radio">
              <el-radio :label="3">备选项</el-radio>
              <el-radio :label="6">备选项</el-radio>
              <el-radio :label="9">备选项</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="名称" prop="providerId">
          <el-autocomplete
            v-model="temp.providerName"
            value-key="name"
            class="inline-input"
            :fetch-suggestions="providerSearch"
            placeholder="请输入名称或编号新增备件"
            style="width:200px"
            @select="handleSelect"
          />
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      class="elTable"
    >
      <!-- table表格 -->
      <el-table-column label="名称" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form
      ref="repairwTemp"
      :model="repairwTemp"
      label-position="right"
      label-width="100px"
      style="width: 800px; margin-left:50px;margin-top:30px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="责任人" prop="employeId">
            <el-select v-model="temp.employeId" placeholder="责任人" class="filter-item">
              <el-option
                v-for="item in findAllEmploye"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="日期" prop="inputDatetime">
            <el-date-picker
              v-model="temp.inputDatetime"
              type="date"
              placeholder="日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width:170px;"
            />
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
      <el-button @click="dialogFormVisibleRepair = false">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { GetDataByName, GetDataByNames, PostDataByName } from '@/api/common'
import { parseTime } from '@/utils/index.js'
// eslint-disable-next-line no-unused-vars
import { validateEMail } from '@/utils/validate.js'
import { MessageBox } from 'element-ui'
export default {
  name: 'RepairW',
  // eslint-disable-next-line vue/require-prop-types
  props: ['repairwTemp'],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      value: false,
      listLoading: true,
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
      },
      // 2-3：下拉框请求后数据加入[]
      findAllProvider: [],
      findAllAssetType: [],
      findAllPasture: [],
      findAllDepart: [],
      findAllEmploye: [],
      getDictByName: [],
      // 2-1.请求下拉框接口
      requestParams: [
        { name: 'findAllProvider', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllAssetType', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllPasture', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllDepart', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllEmploye', offset: 0, pagecount: 0, params: [] },
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['资产状态'] }
      ],

      temp: {},
      dialogFormVisibleRepair: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false
      // 校验规则
    }
  },
  created() {
    this.getDownList()
    this.getList()
  },

  methods: {
    // 供应商模糊查询
    providerSearch(queryString, cb) {
      var returnList = this.findAllProvider
      var results = queryString
        ? returnList.filter(this.createFilter(queryString))
        : returnList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return returnValue => {
        return (
          returnValue.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        )
      }
    },
    handleSelect(item) {
      console.log(item)
      this.temp.providerId = item.id
      this.temp.providerName = item.name
    },
    // 1-1: table&搜索
    getList() {
      this.listLoading = true
      GetDataByName(this.getdataListParm).then(response => {
        this.list = response.data.list
        if (response.data.total) {
          this.total = response.data.total
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 100)
      })
    },
    // 2-2：下拉框
    getDownList() {
      GetDataByNames(this.requestParams).then(response => {
        this.findAllProvider = response.data.findAllProvider.list
        this.findAllAssetType = response.data.findAllAssetType.list
        this.findAllPasture = response.data.findAllPasture.list
        this.findAllDepart = response.data.findAllDepart.list
        this.findAllEmploye = response.data.findAllEmploye.list
        this.getDictByName = response.data.getDictByName.list
      })
    },
    handleFilter() {
      this.listLoading = true
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        // 格式化日期
        inputDatetime: parseTime(new Date(), '{y}-{m}-{d}')
      }
    },
    handleCreateRepair(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusRepair = 'repair'
      this.dialogFormVisibleRepair = true
      // this.$nextTick(() => {
      //   this.$refs["temp"].clearValidate();
      // });
    },
    createData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'insertAsset'
          this.requestParam.parammaps = this.temp

          PostDataByName(this.requestParam).then(response => {
            console.log(response)
            if (response.msg === 'fail') {
              this.$notify({
                title: '失败',
                message: '保存失败-' + response.data,
                type: 'danger',
                duration: 2000
              })
            } else {
              this.getList()
              this.dialogFormVisibleRepair = false
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['temp'].clearValidate()
      // })
    },
    updateData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'updateAsset'
          this.requestParam.parammaps = this.temp
          PostDataByName(this.requestParam).then(response => {
            console.log(response)
            if (response.msg === 'fail') {
              this.$notify({
                title: '失败',
                message: '保存失败-' + response.data,
                type: 'warning',
                duration: 2000
              })
            } else {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      MessageBox.confirm('设备名称：' + row.equipmentName, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.requestParam.name = 'deleteAsset'
          this.requestParam.parammaps = {}
          this.requestParam.parammaps['id'] = row.id
          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>
