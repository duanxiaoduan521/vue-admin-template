<template>

  <div class="app-container">
    <div style="margin-top: 10px">
      <svg-icon icon-class="marker" style="color: #606266" />
      <span class="font-small">保养模板</span>
      <el-button class="font-small" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table
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
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="部位" header-align="center" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.partName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.program }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.standard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行动作" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.active }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保养内容" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.maintenanceContent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="保养周期" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.week }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" header-align="center" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="stcokUpdate(row)">
            备件
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='已删'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出层新增or修改 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible_by"
      :close-on-click-modal="false"
      style="width: 800px;margin:0 auto;"
    >
      <el-form
        ref="upkeepForm"
        :rules="rules"
        :model="upkeepForm"
        label-position="right"
        label-width="100px"
        style="width: 300px; margin-left:50px;"
      >
        <el-form-item label="部位：" prop="part">
          <el-select v-model="upkeepForm.partId" placeholder="部位" class="filter-item">
            <el-option
              v-for="item in findAllPart"
              :key="item.id"
              :label="item.partName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="项目:" prop="program">
          <el-input
            ref="program"
            v-model="upkeepForm.program"
          />
        </el-form-item>

        <el-form-item label="标准:" prop="standard">
          <el-input
            ref="standard"
            v-model="upkeepForm.standard"
          />
        </el-form-item>

        <el-form-item label="执行动作:" prop="active">
          <el-input
            ref="active"
            v-model="upkeepForm.active"
          />
        </el-form-item>
        <el-form-item label="保养内容:" prop="maintenanceContent">
          <el-input
            ref="maintenanceContent"
            v-model="upkeepForm.maintenanceContent"
          />
        </el-form-item>

        <el-form-item label="保养周期:" prop="week">
          <el-select v-model="upkeepForm.week" placeholder="标准" class="filter-item">
            <el-option
              v-for="item in getDictByName"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="dialogStatus==='create'"
          ref="createb"
          type="success"
          @click="createData_again()"
        >确认新增</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
        <el-button @click="dialogFormVisible_by = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 弹出层备件信息 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible_by22"
      :close-on-click-modal="false"
    >
      <el-form
        ref="upkeepForm"
        :rules="rules"
        :model="upkeepForm"
        label-position="right"
        label-width="100px"
        style="width: 800px; margin-left:50px;"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="编号/名称：" prop="stockA">
              <el-autocomplete
                v-model="stockAAA.stockA"
                style="width:350px;"
                class="inline-input mediaInput"
                :fetch-suggestions="stockSearch"
                placeholder="请输入备件编号或者备件名称"
                :trigger-on-focus="false"
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <div class="name" style="display: inline;">{{ item.stockNumber }}</div>
                  <span class="addr">{{ item.stockName }}</span>
                </template>
              </el-autocomplete>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible_by22 = false">关闭</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        :data="list2"
        border
        fit
        highlight-current-row
        style="width: 90%;"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        class="elTable"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column label="备件编号" header-align="center" width="100px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.stockNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备件名称" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.stockName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.specification }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <input v-model="scope.row.amount" type="text" style="width:50px;border:none;">
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <input v-model="scope.row.note" type="text" style="width:80px;border:none;">
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center" width="260" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="stockAdd(row)">
              添加
            </el-button>
            <el-button type="primary" size="mini" @click="stockDel(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_by22 = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import enterToNext from '@/directive/enterToNext' // enterToNext directive
import { PostDataByName, GetDataByName, GetDataByNames } from '@/api/common'
import { isIntegerZero } from '@/utils/validate'
import { MessageBox } from 'element-ui'
export default {
  name: 'Baoyang',
  directives: { waves, enterToNext },
  props: {
    assetTypeid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dictid: 0,
      list: [],
      list2: [],
      total: 0,
      listLoading: true,
      requestParam: {
        name: '',
        parammaps: {}
        // params: []
      },
      upkeepForm: {
        id: '',
        program: '',
        standard: '',
        active: '',
        maintenanceContent: '',
        week: '',
        partName: '',
        partId: ''

      },
      stockAAA: {
        stockA: '',
        stockNumber: '',
        stockName: '',
        specification: '',
        amount: '',
        note: '',
        upkeepTemplateId: '',
        partIdA: ''
      },
      requestFilterParams: {
        returntype: 'Map',
        parammaps: {}
      },
      getdataListParm: { name: 'getUpkeepTemplateList',
        offset: 1,
        pagecount: 8,
        params: [] },
      rules: {
        label: [{ type: 'string', required: true, message: '名称必填', trigger: 'change' }],
        value: [{ type: 'string', required: true, message: '只必填', trigger: 'change' }],
        orderby: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible_by: false,
      dialogFormVisible_by22: false,
      parentDeptVisible: true,
      dialogStatus: '',

      // 2-3：下拉框请求后数据加入[]
      getDictByName: [],
      findAllPart: [],

      // 2-1.请求下拉框接口
      requestParams: [
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['保养模板周期'] },
        { name: 'findAllPart', offset: 0, pagecount: 0, params: [] }
      ],

      textMap: {
        update: '编辑',
        create: '添加'
      },
      parent: [],
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' }
    }
  },

  watch: {
    assetTypeid(val) {
      this.getdataListParm.params = [this.assetTypeid]
      this.getList()
    }
  },
  created() {
    this.getList()
  },

  // 设置变量
  aa: '',

  methods: {

    // 模糊查询
    stockSearch(queryString, cb) {
      this.requestFilterParams.name = 'findUpkeepSBOM1'
      this.requestFilterParams.parammaps = {}
      this.requestFilterParams.parammaps['stockA'] = queryString
      // this.requestFilterParams.parammaps['partId'] = ''

      GetDataByName(this.requestFilterParams).then(response => {
        console.log(response.data.list)
        cb(response.data.list)
      })
    },

    handleSelect(item) {
      console.log(item)
      GetDataByName(this.requestFilterParams).then(response => {
        this.stockAAA.stockNumber = item.stockNumber
        this.stockAAA.stockName = item.stockName
        this.stockAAA.specification = item.specification
        this.stockAAA.amount = item.amount
        this.stockAAA.note = item.note
        this.stockAAA.upkeepTemplateId = item.upkeepTemplateId
        this.stockAAA.partIdA = item.partIdA
        this.createSearch()
      })
    },

    // 模糊查询保存接口
    createSearch() {
      if (this.list.length > 0) {
        this.requestParam.name = 'insertUpkeepSBOM1'
        this.requestParam.parammaps = {}
        this.requestParam.parammaps = this.stockAAA
        this.requestParam.parammaps['upkeepTemplateId'] = this.list[0].id

        PostDataByName(this.requestParam).then(() => {
          // this.dialogFormVisible_bw = false
          this.$notify({
            title: '成功',
            message: '新增成功',
            type: 'success',
            duration: 2000
          })
          this.uplodeStockList111(this.list[0].id)
        })
      }
    },

    // 刷新活的信息
    uplodeStockList111(row) {
      if (this.list.length > 0) {
        this.requestFilterParams.parammaps = {}
        this.requestFilterParams.name = 'getUpkeepSBOM1'
        this.requestFilterParams.parammaps['assetTypeId'] = this.assetTypeid
        this.requestFilterParams.parammaps['upkeepTempId'] = this.upkeepTempid
        GetDataByName(this.requestFilterParams).then(response => {
          this.list2 = response.data.list
        })
      }
    },

    // 加载备件列表信息
    uplodeStockList(row) {
      console.log(row)
      console.log(row.partId)
      if (this.list.length > 0) {
        this.requestFilterParams.parammaps = {}
        this.requestFilterParams.parammaps['partIdA'] = row.partId
        this.requestFilterParams.name = 'getUpkeepSBOM1'
        this.requestFilterParams.parammaps['assetTypeId'] = this.assetTypeid
        this.requestFilterParams.parammaps['upkeepTempId'] = row.id
        this.requestFilterParams.parammaps['partId'] = row.partId
        GetDataByName(this.requestFilterParams).then(response => {
          this.list2 = response.data.list
        })
      }
    },

    stcokUpdate(row) {
      // 点击备件按钮的时候加载表格信息
      this.uplodeStockList(row)

      GetDataByName(this.requestFilterParams).then(response => {
        this.dialogFormVisible_by22 = true
      })
    },

    jump() {
      this.$router.push('/console/menu')
    // 传递的参数用{{ $route.query.goodsId }}获取
    //  this.$router.push({ path: '/cart?goodsId=12' })
    // this.$router.go(-2)
    // 后退两步
    },

    // 下拉框
    getDownList() {
      GetDataByNames(this.requestParams).then(response => {
        this.getDictByName = response.data.getDictByName.list
        this.findAllPart = response.data.findAllPart.list
      })
    },

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
    resetRequestParam() {
      this.upkeepForm.id = ''
      this.upkeepForm.program = ''
      this.upkeepForm.standard = ''
      this.upkeepForm.active = ''
      this.upkeepForm.maintenanceContent = ''
      this.upkeepForm.week = ''
      this.upkeepForm.partName = ''
      this.upkeepForm.partId = ''
    },
    handleCreate() {
      this.resetRequestParam()
      this.dialogStatus = 'create'
      this.dialogFormVisible_by = true
      this.$nextTick(() => {
        this.getDownList()
      })
    },
    createData() {
      this.$refs['upkeepForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'insertUpkeepTemplate'

          this.upkeepForm.assetTypeid = this.getdataListParm.params[0]
          this.requestParam.parammaps = this.upkeepForm

          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.dialogFormVisible_by = false
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    createData_again() {
      this.$refs['upkeepForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'insertUpkeepTemplate'
          this.requestParam.parammaps = []

          this.upkeepForm.assetTypeid = this.getdataListParm.params[0]
          this.requestParam.parammaps = this.upkeepForm

          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.resetRequestParam()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.upkeepForm.id = row.id
      this.upkeepForm.program = row.program
      this.upkeepForm.standard = row.standard
      this.upkeepForm.active = row.active
      this.upkeepForm.maintenanceContent = row.maintenanceContent
      this.upkeepForm.week = row.week
      this.upkeepForm.partId = row.partId
      this.upkeepForm.partName = row.partName
      this.dialogStatus = 'update'
      this.dialogFormVisible_by = true
      this.$nextTick(() => {
        this.getDownList()
      })
    },
    updateData() {
      this.$refs['upkeepForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'updateUpkeepTemplate'
          this.requestParam.parammaps = {}
          this.requestParam.parammaps['program'] = this.upkeepForm.program
          this.requestParam.parammaps['standard'] = this.upkeepForm.standard
          this.requestParam.parammaps['id'] = this.upkeepForm.id
          this.requestParam.parammaps['active'] = this.upkeepForm.active
          this.requestParam.parammaps['maintenanceContent'] = this.upkeepForm.maintenanceContent
          this.requestParam.parammaps['week'] = this.upkeepForm.week
          this.requestParam.parammaps['partId'] = this.upkeepForm.partId
          this.requestParam.parammaps['partName'] = this.upkeepForm.partName
          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.resetRequestParam()
            this.dialogFormVisible_by = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    handleEnableChange(index, row) {
      this.requestParam.name = 'updateUpkeepTemplate'
      this.requestParam.params = {}
      this.requestParam.parammaps['program'] = row.program
      this.requestParam.parammaps['standard'] = row.standard
      this.requestParam.parammaps['id'] = row.id
      this.requestParam.parammaps['active'] = row.active
      this.requestParam.parammaps['maintenanceContent'] = row.maintenanceContent
      this.requestParam.parammaps['week'] = row.week
      this.requestParam.parammaps['partId'] = row.partId
      this.requestParam.parammaps['partName'] = row.partName
      PostDataByName(this.requestParam).then(() => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      MessageBox.confirm('sql名称：' + row.program, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestParam.name = 'deleteUpkeepTemplate'
        this.requestParam.parammaps = {}
        this.requestParam.parammaps['id'] = row.id
        PostDataByName(this.requestParam).then(() => {
          this.getList()
          this.resetRequestParam()
          this.dialogFormVisible_by = false
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
    },

    // 备件信息保存（修改接口）
    stockAdd(row) {
      console.log(row)
      this.requestParam.parammaps = {}
      this.requestParam.name = 'updateUpkeepSBOM1'
      this.requestParam.parammaps['amount'] = row.amount
      this.requestParam.parammaps['note'] = row.note
      this.requestParam.parammaps['id'] = row.id
      PostDataByName(this.requestParam).then(response => {
        if (response.msg === 'fail') {
          this.$notify({
            title: '失败',
            message: '保存失败-' + response.data,
            type: 'warning',
            duration: 2000
          })
          this.uplodeStockList111(row.upkeepTemplateId)
        } else {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.uplodeStockList111(row.upkeepTemplateId)
        }
      })
    },
    // 备件信息删除
    stockDel(row) {
      MessageBox.confirm('确认删除此条信息？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.requestParam.name = 'deleteUpkeepSBOM'
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
            setTimeout(() => {
              this.listLoading = false
              this.uplodeStockList111(row.upkeepTemplateId)
            }, 100)
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
