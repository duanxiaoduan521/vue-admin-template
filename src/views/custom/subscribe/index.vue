<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索条件 -->
      <el-input
        v-model="getdataListParm.parammaps.stockNumber"
        placeholder="备件编号"
        style="width: 140px;"
        class="filter-item"
      />
      <el-input
        v-model="getdataListParm.parammaps.stockName"
        placeholder="备件名称"
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
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
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
      <el-table-column label="牧场/部门" min-width="130px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">牧场：</span>{{ scope.row.pastureName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">部门：</span>{{ scope.row.departName }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="库存/单位" min-width="120px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">当前库存：</span>{{ scope.row.repertory }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">最低库存：</span>{{ scope.row.minRepertory }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">最高库存：</span>{{ scope.row.maxRepertory }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">单位：</span>{{ scope.row.unit }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="申购" min-width="150px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">申购单号：</span>{{ scope.row.purchaseNumber }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">申购数量：</span>{{ scope.row.purchaseNumber }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">申购人：</span>{{ scope.row.employeName }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stockName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.provider }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用途" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.purpose }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日期" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" style="margin-top:10px;width:70px;" @click="handleUpdate(row)">主管审核</el-button>
          <el-button type="success" size="mini" style="margin-top:10px;width:70px;" @click="handleUpdate(row)">库管审核</el-button>
          <el-button type="success" size="mini" style="margin-top:10px;" @click="handleUpdate(row)">审核</el-button>
          <el-button type="danger" size="mini" style="margin-top:10px;" @click="handleDelete(row)">删除</el-button>
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
          <el-col :span="12">
            <el-form-item label="申购单编号" prop="assetNumber">
              <el-input ref="assetNumber" v-model="temp.assetNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否加急" prop="assetNumber">
              <el-switch v-model="value" active-color="#13ce66" inactive-color="#eee" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="providerId">
              <el-autocomplete
                v-model="temp.providerName"
                value-key="name"
                class="inline-input"
                :fetch-suggestions="providerSearch"
                placeholder="请输入名称或编号新增备件"
                style="width:300px"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
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
        style="width: 100%;margin-bottom:30px"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        class="elTable"
      >
        <!-- table表格 -->
        <el-table-column label="类型" min-width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.pastureName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="id" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.assetNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" min-width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.pastureName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="id" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.assetNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="id" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.assetNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="150"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button type="success" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
            <el-form-item label="录入时间" prop="inputDatetime">
              <el-date-picker
                v-model="temp.inputDatetime"
                type="date"
                placeholder="录入时间"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width:170px;"
              />
            </el-form-item>
          </el-col>
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
        </el-row>
        <el-row>
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
          <el-col :span="8">
            <el-form-item label="部门" prop="departmentId">
              <el-select v-model="temp.departmentId" placeholder="部门" class="filter-item">
                <el-option
                  v-for="item in findAllDepart"
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
        <!-- <el-button
          v-if="dialogStatus==='create'"
          ref="createb"
          type="success"
          @click="createData_again()"
        >确认新增</el-button> -->
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// / 引入
import { GetDataByName, GetDataByNames, PostDataByName } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
// eslint-disable-next-line no-unused-vars
import { validateEMail } from '@/utils/validate.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'Subscribe',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      value: false,
      listLoading: true,
      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getStockPurchaseList',
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
      getdataListParmCreate: {
        name: 'createSubscriptionNumber',
        page: 0,
        offset: 0,
        pagecount: 0,
        returntype: 'Map',
        parammaps: {}
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
      var results = queryString
        ? returnList.filter(this.createFilter(queryString))
        : returnList
      // 调用 callback 返回建议列表的数据
      cb(results)
      console.log(results)
    },
    createFilter(queryString) {
      return returnValue => {
        return (
          returnValue.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        )
      }
    },
    handleSelect(item) {
      console.log(item.name)
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      GetDataByName(this.getdataListParmCreate).then(response => {
        this.listCreate = response.data.list
        this.$nextTick(() => {
          this.$refs['assetNumber'].$el.children[0].value = this.listCreate[0].subNumber
          console.log(this.listCreate[0].subNumber)
          console.log(this.$refs['assetNumber'].$el.children[0])
        })
      })
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
      MessageBox.confirm('申购单号' + row.purchaseNumber, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.requestParam.name = 'deleteStockPurchase'
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
