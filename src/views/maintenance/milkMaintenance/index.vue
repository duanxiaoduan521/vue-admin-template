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
      <el-date-picker
        v-model="getdataListParm.parammaps.vintage"
        type="year"
        placeholder="年份"
        style="width:170px;top:-3px;"
        format="yyyy"
        value-format="yyyy"
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
      >添加</el-button> -->
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
      <el-table-column label="设备类型" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.assetName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保养项目" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.program }}</span>
        </template>
      </el-table-column>

      <el-table-column label="保养周期" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次保养时间" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.lastUpkeepPeriod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下次保养时间" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nextUpkeepPeriod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新进度条" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.progress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="1" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="2" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="3" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m3 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="4" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m4 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="5" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m5 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="6" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m6 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="7" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m7 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="8" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m8 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="9" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m9 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="10" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m10 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="11" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m11 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="12" min-width="70%" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.m12 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">卡片</el-button>
          <el-button type="success" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column> -->
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
            <el-form-item label="资产编号" prop="assetNumber">
              <el-input ref="assetNumber" v-model="temp.assetNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input ref="equipmentName" v-model="temp.equipmentName" />
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
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="规格" prop="specification">
              <el-input ref="specification" v-model="temp.specification" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌" prop="providerId">
              <el-autocomplete
                v-model="state1"
                value-key="name"
                class="inline-input"
                :fetch-suggestions="providerSearch"
                placeholder="请输入内容"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用途" prop="purpose">
              <el-input ref="purpose" v-model="temp.purpose" />
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
          <el-col :span="8">
            <el-form-item label="负责人" prop="employeId">
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="购置日期" prop="purchaseDate">
              <el-date-picker
                v-model="temp.purchaseDate"
                type="date"
                placeholder="选择日期"
                style="width:170px;"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
              <!-- <el-input ref="deptname" v-model="temp.purchaseDate" @keyup.enter.native="deptenter" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入场日期" prop="entranceDate">
              <el-date-picker
                v-model="temp.entranceDate"
                type="date"
                placeholder="选择日期"
                style="width:170px;"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="牧场设备编号" prop="equipmentNumber">
              <el-input ref="equipmentNumber" v-model="temp.equipmentNumber" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="年保养费用" prop="yearUpkeepCost">
              <el-input ref="yearUpkeepCost" v-model="temp.yearUpkeepCost" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年维修费用" prop="yearMaintainDost">
              <el-input ref="yearMaintainDost" v-model="temp.yearMaintainDost" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原值" prop="yuanzhi">
              <el-input ref="yuanzhi" v-model="temp.yuanzhi" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备类别" prop="typeName">
              <el-select v-model="temp.assTypeId" placeholder="设备类别" class="filter-item">
                <el-option
                  v-for="item in findAllAssetType"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="财务编号" prop="financeNumber">
              <el-input
                ref="financeNumber"
                v-model="temp.financeNumber"
                @keyup.enter.native="deptenter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="录入时间" prop="inputDatetime">
              <el-date-picker
                v-model="temp.inputDatetime"
                type="date"
                placeholder="录入时间"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                disabled
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
  name: 'MilkMaintenance',
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
        name: 'getMilkingPlanList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          pastureName: '',
          vintage: ''
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
