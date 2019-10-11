<template>

  <div class="app-container">
    <div style="margin-top: 10px">
      <svg-icon icon-class="marker" style="color: #606266" />
      <span class="font-small">故障</span>
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
      <el-table-column label="部位" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.partName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="故障" header-align="center" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appearanceName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
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
      :visible.sync="dialogFormVisible_gz"
      :close-on-click-modal="false"
      style="width: 800px;margin:0 auto;"
    >
      <el-form
        ref="troubleFrom"
        :rules="rules"
        :model="troubleFrom"
        label-position="right"
        label-width="100px"
        style="width: 300px; margin-left:50px;"
      >
        <el-form-item label="部位：" prop="part">
          <el-select v-model="troubleFrom.partId" placeholder="部位" class="filter-item">
            <el-option
              v-for="item in findAllPart"
              :key="item.id"
              :label="item.partName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="故障名称:" prop="appearanceName">
          <el-input
            ref="appearanceName"
            v-model="troubleFrom.appearanceName"
          />
        </el-form-item>

        <el-form-item label="备注:" prop="note">
          <el-input
            ref="note"
            v-model="troubleFrom.note"
          />
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
        <el-button @click="dialogFormVisible_gz = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 弹出层备件信息 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible_gz22"
      :close-on-click-modal="false"
    >
      <el-form
        ref="troubleFrom"
        :rules="rules"
        :model="troubleFrom"
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
                <el-button @click="dialogFormVisible_gz22 = false">关闭</el-button>
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
        <el-button @click="dialogFormVisible_gz22 = false">关闭</el-button>
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
  name: 'Guzhang',
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
      gzId: '',
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
      troubleFrom: {
        partId: '',
        partName: '',
        appearanceName: '',
        note: ''
      },

      stockAAA: {
        stockA: '',
        stockNumber: '',
        stockName: '',
        specification: '',
        amount: '',
        note: '',
        appearanceId: '',
        partIdA: ''
      },
      requestFilterParams: {
        returntype: 'Map',
        parammaps: {}
      },
      getdataListParm: { name: 'getAppearanceList',
        offset: 0,
        pagecount: 0,
        params: [] },
      rules: {
        label: [{ type: 'string', required: true, message: '名称必填', trigger: 'change' }],
        value: [{ type: 'string', required: true, message: '只必填', trigger: 'change' }],
        orderby: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible_gz: false,
      dialogFormVisible_gz22: false,
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
      if (this.assetTypeid != null) {
        this.getdataListParm.params = [this.assetTypeid]
        this.getList()
      }
    }
  },
  created() {
  },

  methods: {
    // 模糊查询
    stockSearch(queryString, cb) {
      this.requestFilterParams.name = 'findUpkeepSBOM'
      this.requestFilterParams.parammaps = {}
      this.requestFilterParams.parammaps['stockA'] = queryString

      GetDataByName(this.requestFilterParams).then(response => {
        console.log(response.data.list)
        cb(response.data.list)
      })
    },

    handleSelect(item) {
      var tempval = 0
      if (this.list2 !== null) {
        for (let i = 0; i < this.list2.length; i++) {
          if (this.list2[i].stockNumber === item.stockNumber) {
            tempval = 1
            this.$message({
              type: 'info',
              message: '已存在此备件'
            })
            break
          }
        }
      }
      if (tempval === 0) {
        this.stockAAA = {}
        this.stockAAA.stockNumber = item.stockNumber
        this.stockAAA.stockName = item.stockName
        this.stockAAA.specification = item.specification
        this.stockAAA.amount = item.amount
        this.stockAAA.note = item.note
        this.stockAAA.appearanceId = item.appearanceId
        this.stockAAA.partIdA = item.partIdA
        this.createAppearanceStock()
      }
    },

    // 模糊查询保存接口
    createAppearanceStock() {
      if (this.list.length > 0) {
        this.requestParam.name = 'insertAppearanceStock1'
        this.requestParam.parammaps = {}
        this.requestParam.parammaps = this.stockAAA
        this.requestParam.parammaps['appearanceId'] = this.gzId

        PostDataByName(this.requestParam).then(() => {
          // this.dialogFormVisible_bw = false
          this.$notify({
            title: '成功',
            message: '新增成功',
            type: 'success',
            duration: 2000
          })
          setTimeout(() => {
            this.listLoading = false
            this.uplodeStockList111()
          }, 100)
        })
      }
    },

    // 刷新活的信息
    uplodeStockList111() {
      if (this.list2.length > 0) {
        this.requestFilterParams.parammaps = {}
        this.requestFilterParams.name = 'getAppearanceStock1'
        this.requestFilterParams.parammaps['assetTypeid'] = this.assetTypeid
        this.requestFilterParams.parammaps['appearanceId'] = this.gzId
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
        this.requestFilterParams.name = 'getAppearanceStock1'
        this.requestFilterParams.parammaps['assetTypeid'] = this.assetTypeid
        this.requestFilterParams.parammaps['appearanceId'] = row.id
        this.gzId = row.id
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
        this.dialogFormVisible_gz22 = true
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
      this.troubleFrom.id = ''
      this.troubleFrom.partId = ''
      this.troubleFrom.partName = ''
      this.troubleFrom.appearanceName = ''
      this.troubleFrom.note = ''
      this.troubleFrom.assetTypeid = ''
    },
    handleCreate() {
      this.resetRequestParam()
      this.dialogStatus = 'create'
      this.dialogFormVisible_gz = true
      this.$nextTick(() => {
        this.getDownList()
      })
    },
    createData() {
      this.$refs['troubleFrom'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'insertAppearance'
          this.requestFilterParams.parammaps = {}
          this.troubleFrom.assetTypeid = this.getdataListParm.params[0]
          this.requestParam.parammaps = this.troubleFrom

          /*   this.requestParam.params = []
          this.troubleFrom.assetTypeid = this.getdataListParm.params[0]
          this.requestParam.params = this.troubleFrom */

          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.dialogFormVisible_gz = false
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
      this.$refs['troubleFrom'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'insertAppearance'

          this.requestParam.parammaps = {}
          this.troubleFrom.assetTypeid = this.getdataListParm.params[0]
          this.requestParam.parammaps = this.troubleFrom

          /*  this.requestParam.params = []
          this.troubleFrom.assetTypeid = this.getdataListParm.params[0]
          this.requestParam.params = this.troubleFrom*/

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
      this.troubleFrom.id = row.id
      this.troubleFrom.partId = row.partId
      this.troubleFrom.partName = row.partName
      this.troubleFrom.appearanceName = row.appearanceName
      this.troubleFrom.note = row.note
      this.dialogStatus = 'update'
      this.dialogFormVisible_gz = true
      this.$nextTick(() => {
        this.getDownList()
      })
    },
    updateData() {
      this.$refs['troubleFrom'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'updateAppearance'
          this.requestParam.parammaps = {}
          this.requestParam.parammaps['partId'] = this.troubleFrom.partId
          this.requestParam.parammaps['partName'] = this.troubleFrom.partName
          this.requestParam.parammaps['appearanceName'] = this.troubleFrom.appearanceName
          this.requestParam.parammaps['note'] = this.troubleFrom.note
          this.requestParam.parammaps['id'] = this.troubleFrom.id

          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.resetRequestParam()
            this.dialogFormVisible_gz = false
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
      this.requestParam.name = 'updateAppearance'
      this.requestParam.parammaps = {}
      this.requestParam.parammaps['partId'] = row.partId
      this.requestParam.parammaps['partName'] = row.partName
      this.requestParam.parammaps['appearanceName'] = row.appearanceName
      this.requestParam.parammaps['note'] = row.note
      this.requestParam.parammaps['id'] = row.id
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
      MessageBox.confirm('sql名称：' + row.partName, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestParam.name = 'deleteAppearance'
        this.requestParam.parammaps = {}
        this.requestParam.parammaps['id'] = row.id
        PostDataByName(this.requestParam).then(() => {
          this.getList()
          this.resetRequestParam()
          this.dialogFormVisible_gz = false
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
      this.requestParam.name = 'updateAppearanceStock1'
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
          this.uplodeStockList111()
        } else {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.uplodeStockList111()
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
          this.requestParam.name = 'deleteAppearanceStock'
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
              this.uplodeStockList111()
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
