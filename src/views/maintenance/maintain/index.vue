<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索条件 -->
      <el-input
        v-model="getdataListParm.parammaps.assetNumber"
        placeholder="设备编号"
        style="width: 140px;"
        class="filter-item"
      />
      <el-date-picker
        v-model="getdataListParm.parammaps.date"
        type="date"
        placeholder="日期"
        style="width:170px;top:-4px;"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>-->
    </div>

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
      <el-table-column label="牧场" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产编号" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.assetNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备编号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.equipmentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.assetName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="设备类型" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保养周期" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.mode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点检结果" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inspectionResults }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保养项目" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.baoYang }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划保养时间" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保养人" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.upkeepPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保养时间" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.actualTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditPerson }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <!-- <el-button type="success" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>-->
          <el-button type="success" size="mini" @click="handleExamine(row)">审核</el-button>
          <el-button type="success" size="mini" @click="handleUpdate(row)">详细维保</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="getdataListParm.offset"
      :limit.sync="getdataListParm.pagecount"
      @pagination="getList"
    />
    <!-- 弹出层新增or修改 -->
    <!-- 审核 -->
    <el-dialog
      :title="textMap[dialogStatusExamine]"
      :visible.sync="dialogFormVisibleExamine"
      :close-on-click-modal="false"
      style="width:400px;margin:0 auto;"
    >
      <h3>是否通过审核?</h3>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="dialogStatusExamine==='create'"
          ref="createb"
          type="success"
          @click="createData_again()"
        >确认新增</el-button>
        <el-button type="primary" @click="dialogStatusExamine==='create'?createDataExamine():updateDataExamine()">确认</el-button>
        <el-button @click="dialogFormVisibleExamine = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 详细维保 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="temp"
        :model="temp"
        label-position="right"
        label-width="110px"
        style="width: 800px; margin-left:50px;"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="资产编号" prop="assetNumber">
              <el-input ref="assetNumber" v-model="temp.assetNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="牧场设备编号" prop="equipmentName">
              <el-input ref="equipmentName" v-model="temp.equipmentName" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="牧场" prop="pastureId">
              <el-select v-model="temp.pastureId" placeholder="牧场" class="filter-item">
                <el-option
                  v-for="item in findAllPasture"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input ref="equipmentName" v-model="temp.equipmentName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="设备类别" prop="specification">
              <el-input ref="specification" v-model="temp.specification" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="保养周期" prop="specification">
              <el-input ref="specification" v-model="temp.specification" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划保养时间" prop="purpose">
              <el-input ref="purpose" v-model="temp.purpose" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="保养内容" prop="purpose">
              <el-input ref="purpose" v-model="temp.purpose" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- table1 -->
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
        <el-table-column label="项目" prop="id" sortable="custom" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.pastureName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部位" prop="id" sortable="custom" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.assetNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标准" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.equipmentNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备类别" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.assetName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="执行动作" width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保养周期" width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectionResults }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保养内容" width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectionResults }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否已保养" width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectionResults }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保养时间" width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectionResults }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- table2 -->
      <h3>备件列表</h3>
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
        <el-table-column label="部位" prop="id" sortable="custom" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.pastureName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="id" sortable="custom" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.assetNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用途" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.equipmentNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.assetName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="领用数量" width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料编号" width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectionResults }}</span>
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
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入
import { GetDataByName, GetDataByNames, PostDataByName } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
// eslint-disable-next-line no-unused-vars
// import { validateEMail } from '@/utils/validate.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'Maintain',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      state1: '',
      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getNewUpkeepList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          assetNumber: '',
          date: ''
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
      dialogFormVisible: false,
      dialogFormVisibleExamine: false,
      dialogStatus: '',
      dialogStatusExamine: '',
      textMap: {
        update: '编辑',
        examine: '审核',
        create: '新增'
      },
      dialogPvVisible: false,
      // 校验规则
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' }
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['temp'].clearValidate()
      // })
    },
    updateData() {
      // this.$refs['temp'].validate(valid => {
      //   if (valid) {
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
            message: '详细审核成功',
            type: 'success',
            duration: 2000
          })
        }
      })
      //   }
      // })
    },
    // 审核
    handleExamine(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'examine'
      this.dialogFormVisibleExamine = true
      // this.$nextTick(() => {
      //   this.$refs['temp'].clearValidate()
      // })
    },
    updateDataExamine() {
      this.requestParam.name = 'upkeepCheck'
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
            message: '审核成功',
            type: 'success',
            duration: 2000
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
  .fixed-width .el-button--mini{width: 70px;}
</style>
