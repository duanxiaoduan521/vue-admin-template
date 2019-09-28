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
        v-model="getdataListParm.parammaps.createTime"
        type="date"
        placeholder="领用时间"
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
          <span>{{ scope.row.inspectionDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.providerName }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" align="center" width="350" class-name="small-padding fixed-width">
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
            <el-form-item label="资产编号" prop="assetNumber">
              <el-input ref="assetNumber" v-model="temp.assetNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称" prop="assetName">
              <el-input ref="assetName" v-model="temp.assetName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注" prop="note">
              <el-input ref="note" v-model="temp.note" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备类别" prop="assetType">
              <el-input ref="assetType" v-model="temp.assetType" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="点检人" prop="employeId">
              <el-select v-model="temp.employeId" placeholder="点检人" class="filter-item">
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
        <el-table-column label="序号" prop="id" sortable="custom" align="center" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.assetNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部位" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.assetName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检查内容" width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.typeName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="标准" min-width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectionDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="检查结果" min-width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectionDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="110px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.inspectionDate }}</span>
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
import { validateEMail } from '@/utils/validate.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'SpotCheck',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      list1: null,
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
        name: 'getBigSpotcheckList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          assetNumber: '',
          assetName: ''
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
          assetName: ''
        }
      },
      // 2-3：下拉框请求后数据加入[]
      findAllEmploye: [],
      // 2-1.请求下拉框接口
      requestParams: [
        { name: 'findAllEmploye', offset: 0, pagecount: 0, params: [] }
      ],

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
      this.temp = {
        // 格式化日期
        date: parseTime(new Date(), '{y}-{m}-{d}')
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
          this.requestParam.name = 'insertBigSpotcheck'
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
          this.requestParam.name = 'deleteBigSpotcheck'
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
