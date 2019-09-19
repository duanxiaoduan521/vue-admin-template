<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索条件 -->

      <el-select
        v-model="getdataListParm.parammaps.pastureName"
        placeholder="牧场"
        style="width: 140px;"
        class="filter-item"
        clearable
      >
        <el-option
          v-for="item in findAllPasture"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>

      <el-select
        v-model="getdataListParm.parammaps.departName"
        placeholder="部门"
        style="width: 140px;"
        class="filter-item"
        clearable
      >
        <el-option
          v-for="item in findAllDepart"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-input
        v-model="getdataListParm.parammaps.formNumber"
        placeholder="编号"
        clearable
        class="filter-item"
        style="width: 130px"
      />
      <el-input
        v-model="getdataListParm.parammaps.formName"
        placeholder="表名称"
        style="width: 140px;"
        class="filter-item"
      />
      <el-select
        v-model="getdataListParm.parammaps.formType"
        placeholder="蒸汽类型"
        style="width: 140px;"
        class="filter-item"
        clearable
      >
        <el-option
          v-for="item in getDictByName"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
      >添加</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-upload2"
        @click="handleFilter"
      >导入</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
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
      <el-table-column label="牧场" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.departName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="蒸汽表编号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steamNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steamName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类型" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.useType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次值" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="本次值" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当天用气量" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.steamConsumption }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当天费用" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sumPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="记录人" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.putName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button
            type="success"
            size="mini"
            @click="handleUpdate(row)"
          >编辑</el-button>
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
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="蒸汽表编号：" prop="formNumber">
              <el-autocomplete
                ref="formNumber"
                v-model="temp.formNumber"
                value-key="formNumber"
                class="inline-input"
                :fetch-suggestions="formNumberSearch"
                placeholder="请输入内容"
                :disabled="dialogStatus==='update'"
                @select="handleformNumberSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="蒸汽表名称：" prop="formName">
              <el-autocomplete
                ref="formName"
                v-model="temp.formName"
                value-key="formName"
                class="inline-input"
                :fetch-suggestions="formNameSearch"
                placeholder="请输入内容"
                :disabled="dialogStatus==='update'"
                @select="handleformNameSelect"
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="上次值(m³)：" prop="aAmount">
              <el-input
                ref="aAmount"
                v-model="temp.aAmount"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="蒸汽类型：">
              <span>{{ temp.useType }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="牧场：">
              <span>{{ temp.pastureName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门：">
              <span>{{ temp.departName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="责任人：">
              <span>{{ temp.employeName1 }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前值(m³)：" prop="endAmount">
              <el-input
                ref="endAmount"
                v-model="temp.endAmount"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价(元)：" prop="price1">
              <el-input
                ref="price"
                v-model="temp.price1"
                :disabled="dialogStatus==='update'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注：" prop="note">
              <el-input
                ref="note"
                v-model="temp.note"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前时间：" prop="DATE">
              <el-date-picker
                v-model="temp.DATE"
                type="date"
                placeholder="当前时间"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                disabled
                style="width:100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人：" prop="employeId">
              <el-select v-model="temp.employeId" placeholder="负责人" class="filter-item">
                <el-option
                  v-for="item in findAllEmploye"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入
require('script-loader!file-saver')
import { GetDataByName, GetDataByNames, PostDataByName } from '@/api/common'
import waves from '@/directive/waves' // waves directive
// eslint-disable-next-line no-unused-vars
import { validateEMail } from '@/utils/validate.js'
import { parseTime } from '@/utils/index.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'Basics',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,

      requestParam: {
        name: 'insertSteam',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getSteamList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          formName: '',
          formNumber: '',
          formType: '',
          pastureName: '',
          departName: ''
        }
      },
      // 2-3：下拉框请求后数据加入[]
      getDictByName: [],
      findAllAssetType: [],
      findAllPasture: [],
      findAllDepart: [],
      findAllEmploye: [],
      // 2-1.请求下拉框接口
      requestParams: [
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['ZQ流量计类型'] },
        { name: 'findAllAssetType', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllPasture', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllDepart', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllEmploye', offset: 0, pagecount: 0, params: [] }
      ],
      requestFilterParams: {
        name: 'getSteamList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: { }
      },

      temp: { pastureName: '',
        useType: '',
        departName: '',
        aAmount: '',
        employeName1: '',
        formName: '',
        formNumber: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      // 校验规则
      rules: {
        assetNumber: [{ required: true, message: '必填', trigger: 'blur' }
        // 引入自定义校验并使用
          // { validator: validateEMail, trigger: 'blur' }
        ],
        equipmentName: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      MeasureListbyfilter: [],
      rowStyle: { maxHeight: 40 + 'px', height: 30 + 'px' },
      cellStyle: { padding: 0 + 'px' }
    }
  },
  created() {
    this.getDownList()
    this.getList()
  },

  methods: {
    handleDownload() {
      this.requestParam.name = 'meteringOutfit'
      //  this.requestParam.returntype = 'xlsx'
      this.requestParam.parammaps.formType = 'ZQ流量计'
      GetDataByName(this.requestParam).then(response => {
          import('@/vendor/Export2Excel').then(excel => {
            //  const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
            // const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
            //  const data1 = this.formatJson(filterVal, list1)
            // const list1 = response.data.list
            //  const data1 = this.formatJson(filterVal, list1)
            excel.export_json_to_excel({
              // data1,
              filename: 'meteringOutfit',
              autoWidth: true,
              bookType: 'xlsx'
            })
          })
      })
    },
    formNumberSearch(queryString, cb) {
      this.requestFilterParams.name = 'getMeasureListbyfilter'
      this.requestFilterParams.parammaps['formType'] = 'ZQ流量计'
      this.requestFilterParams.parammaps['formNumber'] = queryString
      this.requestFilterParams.parammaps['formName'] = ''
      GetDataByName(this.requestFilterParams).then(response => {
        cb(response.data.list)
      })
    },
    formNameSearch(queryString, cb) {
      this.requestFilterParams.name = 'getMeasureListbyfilter'
      this.requestFilterParams.parammaps['formType'] = 'ZQ流量计'
      this.requestFilterParams.parammaps['formNumber'] = ''
      this.requestFilterParams.parammaps['formName'] = queryString
      GetDataByName(this.requestFilterParams).then(response => {
        cb(response.data.list)
      })
    },
    handleformNumberSelect() {
      this.requestFilterParams.name = 'findByNMeasureSteam'
      this.requestFilterParams.parammaps['formNumber'] = this.temp.formNumber
      this.requestFilterParams.parammaps['formName'] = ''
      GetDataByName(this.requestFilterParams).then(response => {
        this.$nextTick(() => {
          if (response.data.list.length > 0) {
            this.temp.pastureName = response.data.list[0].pastureName
            this.temp.useType = response.data.list[0].useType
            this.temp.departName = response.data.list[0].departName
            this.temp.aAmount = response.data.list[0].aAmount
            this.temp.employeName1 = response.data.list[0].employeName
            this.temp.formName = response.data.list[0].formName
            console.log(response.data.list[0])
          }
        })
      })
    },
    handleformNameSelect() {
      this.requestFilterParams.name = 'findByNMeasureSteam'
      this.requestFilterParams.parammaps['formNumber'] = ''
      this.requestFilterParams.parammaps['formName'] = this.temp.formName
      GetDataByName(this.requestFilterParams).then(response => {
        this.$nextTick(() => {
          if (response.data.list.length > 0) {
            this.temp.pastureName = response.data.list[0].pastureName
            this.temp.useType = response.data.list[0].useType
            this.temp.departName = response.data.list[0].departName
            this.temp.aAmount = response.data.list[0].aAmount
            this.temp.employeName1 = response.data.list[0].employeName
            this.temp.formNumber = response.data.list[0].formNumber
          }
        })
      })
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
        this.getDictByName = response.data.getDictByName.list
        this.findAllAssetType = response.data.findAllAssetType.list
        this.findAllPasture = response.data.findAllPasture.list
        this.findAllDepart = response.data.findAllDepart.list
        this.findAllEmploye = response.data.findAllEmploye.list
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
      this.temp.pastureName = ''
      this.temp.useType = ''
      this.temp.departName = ''
      this.temp.aAmount = ''
      this.temp.employeName1 = ''
      this.temp.formName = ''
      this.temp.formNumber = ''

      this.temp.DATE = parseTime(new Date(), '{y}-{m}-{d}')
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
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'insertSteam'
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
              this.dialogFormVisible = false
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
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    updateData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'updatSteam'
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
      }).then(() => {
        this.requestParam.name = 'deleteSteam'
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
