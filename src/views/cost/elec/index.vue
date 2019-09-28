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
        placeholder="类型"
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
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>
      <el-upload
        style="display: inline-block;"
        :headers="headers"
        :data="uploadData"
        :action="uploadExcelUrl"
        :show-file-list="false"
        :before-upload="beforeImportExcel"
        :on-success="handleImportExcelSuccess"
      >
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-upload2"
          @click="handleFilter"
        >导入</el-button>
      </el-upload>
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
      <el-table-column label="牧场/部门" width="170px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">牧场：</span>{{ scope.row.pastureName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">部门：</span>{{ scope.row.departName }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="电表信息" width="300px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">编号/名称：</span>{{ scope.row.elecNumber }}&#12288;&#12288;{{ scope.row.elecName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">类型：</span>{{ scope.row.useType }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="使用量(°)" width="190px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">上次值：</span>{{ scope.row.lastAmount }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">本次值：</span>{{ scope.row.endAmount }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">当天用电量：</span>{{ scope.row.elecConsumption }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="价格(元)" width="170px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">单价：</span>{{ scope.row.price }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">电率：</span>{{ scope.row.rate }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">当天费用：</span>{{ scope.row.sumPrice }}</span><br>
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
        label-width="110px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="电表编号：" prop="formNumber">
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
            <el-form-item label="电表名称：" prop="formName">
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

          <el-col :span="8">
            <el-form-item label="上次值(m³)：" prop="aAmount">
              <el-input
                ref="aAmount"
                v-model="temp.aAmount"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="类型：">
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
// import {  DownloadExcel, GetDataByNameXlsx } from '@/api/common'
import waves from '@/directive/waves' // waves directive
// eslint-disable-next-line no-unused-vars
// import { isIntegerZero } from '@/utils/validate.js'
import { parseTime } from '@/utils/index.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'
export default {
  name: 'Elec',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,

      requestParam: {
        name: 'insertElectricity',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getElecList',
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
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['电表类型'] },
        { name: 'findAllAssetType', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllPasture', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllDepart', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllEmploye', offset: 0, pagecount: 0, params: [] }
      ],
      requestFilterParams: {
        name: 'getElecList',
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
        endAmount: [{ type: 'number', required: true, validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('不能为空'))
          }
          if (value < 0) {
            callback(new Error('必须大于0'))
          } else if (value < this.temp.aAmount) {
            callback(new Error('必须大于上次值'))
          }
          setTimeout(() => {
            const re = /^\d+$/ // /^[0-9]*[1-9][0-9]*$/
            const rsCheck = re.test(value)
            if (!rsCheck) {
              callback(new Error('请输入整数'))
            } else {
              callback()
            }
          }, 0)
        }, trigger: 'blur' }],
        equipmentName: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      MeasureListbyfilter: [],
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' }
    }
  },

  computed: {
    // 设置请求头
    headers() {
      return {
        // 设置token
        token: getToken()
      }
    },
    uploadData() {
      return {
        name: 'insertElecsMeasure',
        importParams: '编号,牧场,表名称,表编号,本次值,上次值,单价,录入人,备注,电率,jwt_username',
        sheetname: 'SheetJS'
      }
    },
    // 设置上传地址
    uploadExcelUrl() {
      // process.env.VUE_APP_BASE_API是服务器的路径，也是axios的基本路径
      return process.env.VUE_APP_BASE_API + 'authdata/ImportExcel'
    }
  },
  created() {
    this.getDownList()
    this.getList()
  },

  methods: {
    isIntegerZero_(rule, value, callback) {
      if (value === '' || value === undefined || value === null) {
        return callback(new Error('输入不可以为空'))
      }
      if (value.length === 0) {
        return callback(new Error('输入不可以为空'))
      }
      setTimeout(() => {
        const re = /^\d+$/ // /^[0-9]*[1-9][0-9]*$/
        const rsCheck = re.test(value)
        if (!rsCheck) {
          callback(new Error('请输入整数'))
        } else {
          callback()
        }
      }, 0)
    },
    handleDownload() {
      /*       this.requestParam.name = 'meteringOutfit'
      this.requestParam.returntype = 'xlsx'
      this.requestParam.parammaps.formType = '电表'
      GetDataByNameXlsx(this.requestParam).then(response => {
        this.$nextTick(() => {
          DownloadExcel(response, this.requestParam.parammaps.formType)
        }) */
      this.requestParam.name = 'elecMeteringOutfit'
      //  this.requestParam.parammaps.formType = '电表'
      GetDataByName(this.requestParam).then(response => {
        this.$nextTick(() => {
          import('@/vendor/Export2Excel').then(excel => {
            const list1 = response.data.list
            const tHeader = [
              '编号', '牧场', '表名称', '表编号', '上次值', '本次值', '单价', '电率', '录入人', '备注'
            ]
            const filterVal = [
              '编号', '牧场', '表名称', '表编号', '上次值', '本次值', '单价', '电率', '录入人', '备注'
            ]
            const data1 = this.formatJson(filterVal, list1)
            excel.export_json_to_excel({
              header: tHeader,
              data: data1,
              filename: '电表',
              autoWidth: true,
              bookType: 'xlsx'
            })
          })
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    },
    beforeImportExcel(file) {
      /*   const isExcel =
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' */
      const isLt2M = file.size / 1024 / 1024 < 2
      /*  if (!isExcel) {
        this.$message.error(
          '上传文件必须是Xlsx格式!建议先导出，再修改导出文件再导入！'
        )
      }*/
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleImportExcelSuccess(res, file) {
    //  if (res.msg === 'ok') {
      if (res.msg === 'ok') {
        this.$message({
          title: '成功',
          message: '导入成功:' + res.data.success + '条!',
          type: 'success',
          duration: 2000
        })
        if (res.data.err_count > 0) {
          this.$notify({
            title: '失败',
            message: '导入失败:' + res.data.err_count + '条!',
            type: 'danger',
            duration: 2000
          })
        }
      } else {
        this.$notify({
          title: '失败',
          message: '上传失败',
          type: 'danger',
          duration: 2000
        })
      }
    },
    formNumberSearch(queryString, cb) {
      this.requestFilterParams.name = 'getMeasureListbyfilter'
      this.requestFilterParams.parammaps['formType'] = '电表'
      this.requestFilterParams.parammaps['formNumber'] = queryString
      this.requestFilterParams.parammaps['formName'] = ''
      GetDataByName(this.requestFilterParams).then(response => {
        cb(response.data.list)
      })
    },
    formNameSearch(queryString, cb) {
      this.requestFilterParams.name = 'getMeasureListbyfilter'
      this.requestFilterParams.parammaps['formType'] = '电表'
      this.requestFilterParams.parammaps['formNumber'] = ''
      this.requestFilterParams.parammaps['formName'] = queryString
      GetDataByName(this.requestFilterParams).then(response => {
        cb(response.data.list)
      })
    },
    handleformNumberSelect() {
      this.requestFilterParams.name = 'findByNMeasureElec'
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
      this.requestFilterParams.name = 'findByNMeasureElec'
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
          this.requestParam.name = 'insertElectricity'
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
          this.requestParam.name = 'updateElectricity'
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
        this.requestParam.name = 'deleteElectricity'
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
