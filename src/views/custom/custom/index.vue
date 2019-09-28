<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索条件 -->
      <el-select
        v-model="getdataListParm.parammaps.pastureName"
        clearable
        placeholder="牧场"
        class="filter-item"
      >
        <el-option
          v-for="item in findAllPasture"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-input
        v-model="getdataListParm.parammaps.stockNumber"
        placeholder="编号"
        style="width: 140px;"
        class="filter-item"
      />
      <el-input
        v-model="getdataListParm.parammaps.stockName"
        placeholder="名称"
        style="width: 140px;"
        class="filter-item"
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
      >添加</el-button>
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
      <el-table-column label="备件信息" prop="id" align="center" width="260">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">编号：</span>{{ scope.row.stockNumber }} </span><br>
          <span style="float:left;"><span style="font-weight:bold;">名称：</span>{{ scope.row.stockName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">类型：</span>{{ scope.row.categoryName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">用途：</span>{{ scope.row.purpose }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.providerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" min-width="180px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">当前库存( {{ scope.row.unit }} )：</span>{{ scope.row.repertory }} </span><br>
          <span style="float:left;"><span style="font-weight:bold;">最低库存( {{ scope.row.unit }} )：</span>{{ scope.row.minRepertory }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">最高库存( {{ scope.row.unit }} )：</span>{{ scope.row.maxRepertory }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="单价" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预警信息" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.employeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
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
        label-width="100px"
        style="width: 800px; margin-left:50px;"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="备件编号" prop="stockNumber">
              <el-input ref="stockNumber" v-model="temp.stockNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称" prop="stockName">
              <el-input ref="stockName" v-model="temp.stockName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格" prop="specification">
              <el-input ref="specification" v-model="temp.specification" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="备注" prop="note">
              <el-input ref="note" v-model="temp.note" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" prop="providerId">
              <el-autocomplete
                v-model="temp.providerName"
                value-key="name"
                class="inline-input"
                :fetch-suggestions="providerSearch"
                placeholder="请输入内容"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="单位" prop="unit">
              <el-input ref="unit" v-model="temp.unit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="8">
            <el-form-item label="单价" prop="price">
              <el-input ref="price" v-model="temp.price" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="当前库存" prop="repertory">
              <el-input ref="repertory" v-model="temp.repertory" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最低库存" prop="minRepertory">
              <el-input ref="minRepertory" v-model="temp.minRepertory" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="最高库存" prop="maxRepertory">
              <el-input ref="maxRepertory" v-model="temp.maxRepertory" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select v-model="temp.status" placeholder="状态" class="filter-item">
                <el-option
                  v-for="item in getDictByName"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
        </el-row>
        <el-row>

          <el-col :span="8">
            <el-form-item label="用途" prop="purpose">
              <el-input ref="purpose" v-model="temp.purpose" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="预警信息" prop="record">
              <el-input ref="record" v-model="temp.record" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备件类型" prop="categoryName">
              <el-select v-model="temp.categoryName" placeholder="备件类型" class="filter-item">
                <el-option
                  v-for="item in findAllCategory"
                  :key="item.id"
                  :value="item.id"
                  :label="item.categoryName"
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
import { GetDataByName, GetDataByNames, PostDataByName } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
// eslint-disable-next-line no-unused-vars
import { validateEMail } from '@/utils/validate.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'Custom',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getStockList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          stockNumber: '',
          stockName: ''
        }
      },
      getdataProvider: {
        name: 'getStockList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        params: []
      },
      // 2-3：下拉框请求后数据加入[]
      findAllProvider: [],
      findAllAssetType: [],
      findAllPasture: [],
      findAllDepart: [],
      findAllEmploye: [],
      getDictByName: [],
      findAllCategory: [],
      // 2-1.请求下拉框接口
      requestParams: [
        { name: 'findAllProvider', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllAssetType', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllPasture', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllDepart', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllEmploye', offset: 0, pagecount: 0, params: [] },
        {
          name: 'getDictByName',
          offset: 0,
          pagecount: 0,
          params: ['资产状态']
        },
        { name: 'findAllCategory', offset: 0, pagecount: 0, params: [] }
      ],

      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
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
    // 供应商模糊查询
    providerSearch(queryString, cb) {
      var returnList = this.findAllProvider
      var results = queryString ? returnList.filter(this.createFilter(queryString)) : returnList
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
        this.findAllCategory = response.data.findAllCategory.list
        // for (var i = 0; i < this.findAllProvider.length; i++) {
        //   this.findAllProvider[i].value = this.findAllProvider[i].name
        // }
        console.log(this.findAllCategory)
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
          this.requestParam.name = 'insertStock'
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
          this.requestParam.name = 'updateStock'
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
          this.requestParam.name = 'deleteStock'
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
    },
    handleDownload() {
      /*       this.requestParam.name = 'meteringOutfit'
      this.requestParam.returntype = 'xlsx'
      this.requestParam.parammaps.formType = '水表'
      GetDataByNameXlsx(this.requestParam).then(response => {
        this.$nextTick(() => {
          DownloadExcel(response, this.requestParam.parammaps.formType)
        }) */
      this.requestParam.name = 'meteringOutfit'
      this.requestParam.parammaps.formType = '备件信息'
      GetDataByName(this.requestParam).then(response => {
        this.$nextTick(() => {
          import('@/vendor/Export2Excel').then(excel => {
            const list1 = response.data.list
            const tHeader = [
              '牧场', '名称', '规格', '用途', '最低库存', '最高库存', '当前库存', '单位', '供应商'
            ]
            const filterVal = [
              '牧场', '名称', '规格', '用途', '最低库存', '最高库存', '当前库存', '单位', '供应商'
            ]
            const data1 = this.formatJson(filterVal, list1)
            excel.export_json_to_excel({
              header: tHeader,
              data: data1,
              filename: this.requestParam.parammaps.formType,
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
    }
  }
}
</script>
