<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索条件 -->
      <el-input
        v-model="getdataListParm.parammaps.assetNumber"
        placeholder="资产编号"
        style="width: 140px;"
        class="filter-item"
      />
      <el-input
        v-model="getdataListParm.parammaps.assetName"
        placeholder="设备名称"
        style="width: 140px;"
        class="filter-item"
      />
      <el-date-picker
        v-model="getdataListParm.parammaps.date"
        type="date"
        placeholder="点检时间"
        style="width:170px;top:-3px;"
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >点检</el-button>
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
      <el-table-column label="设备编号" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.assetNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.assetName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备类别" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="点检日期" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="品牌" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.providerName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="点检结果" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inspectionResults }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点检人" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inspection }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="temp"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="110px"
        style="width: 800px; margin-left:50px;"
      >
        <el-row>

          <el-col :span="12">
            <el-form-item label="设备名称：" prop="assetName">
              <el-autocomplete
                ref="assetName"
                v-model="assetA.assetName"
                value-key="assetName"
                class="inline-input"
                :fetch-suggestions="formNameSearch"
                placeholder="请输入内容"
                :disabled="dialogStatus==='update'"
                style="width:250px;"
                @select="handleformNameSelect"
              >
                <template slot-scope="{ item }">
                  <div class="name" style="display: inline;">{{ item.assetName }}</div>
                  <span class="addr">{{ item.assetNumber }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="牧场设备编号：" prop="assetNumber">
              <el-autocomplete
                ref="assetNumber"
                v-model="assetA.assetNumber"
                value-key="assetNumber"
                class="inline-input"
                :fetch-suggestions="formNumberSearch"
                placeholder="请输入内容"
                :disabled="dialogStatus==='update'"
                style="width:250px;"
                @select="handleformNumberSelect"
              >
                <template slot-scope="{ item }">
                  <div class="name" style="display: inline;">{{ item.assetName }}</div>
                  <span class="addr">{{ item.assetNumber }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="点检人：" prop="employeId">
              <el-select
                v-model="assetA.employeId"
                placeholder="点检人"
                class="filter-item"
                style="width:150px;"
                :disabled="dialogStatus==='update'"
              >
                <el-option
                  v-for="item in findAllEmploye"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="点检日期：" prop="date">
              <el-date-picker
                v-model="assetA.date"
                type="date"
                placeholder="日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                :disabled="dialogStatus==='update'"
                style="width:170px;"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        :data="tempSolr"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        class="elTable"
      >
        <!-- table表格 -->
        <el-table-column label="部位" width="130px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.partName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检查内容" width="130px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.examine }}</span>
          </template>
        </el-table-column>

        <el-table-column label="标准" min-width="130px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.standard }}</span>
          </template>
        </el-table-column>

        <el-table-column label="检查结果" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.checkResult"
              :active-value="1"
              :inactive-value="0"
              @change="handleEnableChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="备注" min-width="130px" align="center">
          <template slot-scope="scope">
            <input
              v-model="scope.row.note"
              type="text"
              value="scope.row.note"
              style="width:130px;"
              :disabled="dialogStatus==='update'"
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogStatus==='create'" type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入
import { GetDataByName, GetDataByNames, PostDataByName, ExecDataByConfig } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
// eslint-disable-next-line no-unused-vars
import { validateEMail } from '@/utils/validate.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
// import { connect } from 'http2'
export default {
  name: 'SpotCheck',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      list1: null,
      total: 0,
      list2: [],
      listLoading: true,
      state1: '',
      solrASssetTypeId: '',
      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      tempSolr: {
        assetNumber: '',
        assetName: '',
        assTypeId: '',
        assetId: '',
        bigIds: ''
      },
      assetA: {

      },
      requestFilterParams: {
        returntype: 'Map',
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getBigSpotcheckList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          assetNumber: '',
          assetName: '',
          date: ''
        }
      },
      getdataListParmAdd: {
        name: 'getBigSpotcheckList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          assetNumber: '',
          assetName: '',
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

      postDataPramas: {

      },
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '点检'
      },
      dialogPvVisible: false,
      // 校验规则
      rules: {
        assetNumber: [
          { required: true, message: '必填', trigger: 'blur' }
          // 引入自定义校验并使用
          // { validator: validateEMail, trigger: 'blur' }
        ],
        equipmentName: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' }
    }
  },
  created() {
    this.getDownList()
    this.getList()
  },

  methods: {
    // 模糊查询-点检名称
    formNumberSearch(queryString, cb) {
      this.requestFilterParams.name = 'findAssetMain'
      this.requestFilterParams.parammaps['assetNumber'] = queryString
      this.requestFilterParams.parammaps['assetName'] = ''
      GetDataByName(this.requestFilterParams).then(response => {
        cb(response.data.list)
      })
    },
    formNameSearch(queryString, cb) {
      this.requestFilterParams.name = 'findAssetMain'
      this.requestFilterParams.parammaps['assetNumber'] = ''
      this.requestFilterParams.parammaps['assetName'] = queryString
      GetDataByName(this.requestFilterParams).then(response => {
        cb(response.data.list)
      })
    },
    handleformNumberSelect(item) {
      this.requestFilterParams.name = 'findByBigIdSpotCheck'
      this.requestFilterParams.parammaps['assetName'] = ''
      this.requestFilterParams.parammaps['assetNumber'] = item.assetNumber
      this.assetA.assetNumber = item.assetNumber
      this.assetA.assetName = item.assetName
      this.assetA.assTypeId = item.assetTypeId
      this.assetA.assetId = item.assetId

      this.assetA.date = parseTime(new Date(), '{y}-{m}-{d}')
      GetDataByName(this.requestFilterParams).then(response => {
        this.$nextTick(() => {
          if (response.data.list.length > 0) {
            this.tempSolr = response.data.list
            console.log(this.tempSolr)
          }
        })
      })
    },
    handleformNameSelect(item) {
      this.requestFilterParams.name = 'findByBigIdSpotCheck'
      this.requestFilterParams.parammaps['assetNumber'] = item.assetNumber
      this.requestFilterParams.parammaps['assetName'] = ''
      this.assetA.assetNumber = item.assetNumber
      this.assetA.assetName = item.assetName
      this.assetA.assTypeId = item.assetTypeId
      this.assetA.assetId = item.assetId

      this.assetA.date = parseTime(new Date(), '{y}-{m}-{d}')
      GetDataByName(this.requestFilterParams).then(response => {
        this.$nextTick(() => {
          if (response.data.list.length > 0) {
            this.tempSolr = response.data.list
            console.log(this.tempSolr)
          }
        })
      })
    },

    // 将获取的点检信息插入的数据库中big（主表）
    insertBigSpotCheck() {
      if (this.list.length > 0) {
        this.requestFilterParams.name = 'insertBigSpotCheck'
        this.requestFilterParams.parammaps = {}
        this.requestFilterParams.parammaps = this.tempSolr
        console.log(this.requestFilterParams)
        GetDataByName(this.requestFilterParams).then(response => {
          console.log('bigId主键为：' + response.data.list[0].bigId)
          this.tempSolr.bigIds = response.data.list[0].bigId // 获取生成父表中的主键
        })
      }
    },

    // 请求信息，获取点检模板中的信息
    handleSpotCheckTemp(tempSolr) {
      this.requestParams.name = 'findByBigIdSpotCheck'
      this.requestParams.parammaps['bigId'] = this.tempSolr.assTypeId
      GetDataByName(this.requestParams).then(response => {
        this.$nextTick(() => {
          if (response.data.list.length > 0) {
            this.list2 = response.data.list
          }
        })
      })
    },

    // 保存子表中的信息
    insertSpotCheck(tempSolr) {
      this.requestFilterParams.name = 'insertSpotCheck'
      this.requestParam.parammaps = {}
      this.temp.bigId = this.bigIds
      this.temp.assetTypeId = this.tempSolr.assTypeId

      this.requestParam.parammaps['fsion'] = this.list2
      GetDataByName(this.requestParam).then(response => {
        this.$notify({
          title: '成功',
          message: '新增成功',
          type: 'success',
          duration: 2000
        })
        // this.uplodeStockList111()
      })
    },

    handleEnableChange(index, row) {
      if (this.dialogStatus === 'update') {
        this.postDataPramas.common = { 'returnmap': '0' }
        this.postDataPramas.data = []
        this.postDataPramas.data[0] = { 'name': 'updateSpotCheck', 'type': 'e', 'parammaps': {}}
        this.postDataPramas.data[0].parammaps['checkResult'] = row.checkResult
        this.postDataPramas.data[0].parammaps['id'] = row.id
        this.postDataPramas.data[1] = { 'name': 'updateSpotCheckResults', 'type': 'e', 'parammaps': { }}
        this.postDataPramas.data[1].parammaps['id'] = row.bigId
        ExecDataByConfig(this.postDataPramas).then(response => {
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        })
      }
    },

    // 1-1: table&搜索
    getList() {
      this.listLoading = true

      if (this.getdataListParm.parammaps.date === null) {
        this.getdataListParm.parammaps.date = ''
      }
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
      GetDataByName(this.getdataListParmAdd).then(response => {
        this.list1 = response.data.list
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
      this.assetA = {
        // 格式化日期
        date: parseTime(new Date(), '{y}-{m}-{d}')
      }
      this.tempSolr = []
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    createData() {
      this.postDataPramas.common = { 'returnmap': '0' }
      this.postDataPramas.data = []
      this.postDataPramas.data[0] = { 'name': 'checkSpotCheck', 'type': 'v', 'parammaps': { 'assetNumber': this.assetA.assetNumber, 'checkdate': this.assetA.date }}

      this.postDataPramas.data[1] = { 'name': 'insertBigSpotCheck1', 'resultname': 'insertBigSpotcheck1', 'type': 'e', 'parammaps': {}}
      this.postDataPramas.data[2] = { 'name': 'insertSpotList', 'resultmaps': { 'list': [] }}
      this.postDataPramas.data[2].children = []
      this.postDataPramas.data[2].children[0] = { 'name': 'insertSpotCheck1', 'type': 'e', 'parammaps': { }}
      this.assetA.inspectionResults = 0
      this.postDataPramas.data[1].parammaps = this.assetA
      // inspectionResults
      this.postDataPramas.data[2].resultmaps.list = this.tempSolr
      this.postDataPramas.data[2].children[0].parammaps.partName = '@insertSpotList.partName'
      this.postDataPramas.data[2].children[0].parammaps.examine = '@insertSpotList.examine'
      this.postDataPramas.data[2].children[0].parammaps.standard = '@insertSpotList.standard'
      this.postDataPramas.data[2].children[0].parammaps.note = '@insertSpotList.note'
      this.postDataPramas.data[2].children[0].parammaps.assTypeId = '@insertSpotList.assetTypeId'
      this.postDataPramas.data[2].children[0].parammaps.checkResult = '@insertSpotList.checkResult'
      this.postDataPramas.data[2].children[0].parammaps.bigId = '@insertBigSpotcheck1.LastInsertId'
      this.postDataPramas.data[2].children[0].parammaps.partId = '@insertSpotList.partId'
      this.postDataPramas.data[3] = { 'name': 'updateSpotCheckResults', 'type': 'e', 'parammaps': { 'id': '@insertBigSpotcheck1.LastInsertId' }}

      ExecDataByConfig(this.postDataPramas).then(response => {
        if (response.msg === 'fail') {
          this.$notify({
            title: '保存失败',
            message: response.data,
            type: 'warning',
            duration: 2000
          })
        } else {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },

    handleUpdate(row) {
      this.assetA = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.requestFilterParams.name = 'findByIdSpotCheck'
      this.requestFilterParams.parammaps['id'] = this.assetA.id
      GetDataByName(this.requestFilterParams).then(response => {
        this.tempSolr = response.data.list
        if (response.data.total) {
          this.total = response.data.total
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 100)
      })
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
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
      MessageBox.confirm('确认删除此条信息？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.postDataPramas.common = { 'returnmap': '0' }
          this.postDataPramas.data = []
          this.postDataPramas.data[0] = { 'name': 'deleteSpotcheck', 'type': 'e', 'parammaps': { }}
          this.postDataPramas.data[0].parammaps['id'] = row.id
          this.postDataPramas.data[1] = { 'name': 'deleteBigSpotcheck', 'type': 'e', 'parammaps': {}}
          this.postDataPramas.data[1].parammaps['id'] = row.id
          ExecDataByConfig(this.postDataPramas).then(response => {
            this.getList()
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
