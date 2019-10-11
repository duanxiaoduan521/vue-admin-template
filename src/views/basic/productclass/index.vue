<template>
  <div class="app-container">
    <div class="app-container">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
        <el-table-column label="牧场编号" header-align="center" min-width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.pastureNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="牧场名称" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" header-align="center" align="center" width="260" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button v-if="row.status!='已删'" size="mini" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="getdataListParm.offset" :limit.sync="getdataListParm.pagecount" @pagination="getList" />

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form ref="dataForm" v-enterToNext="true" :rules="rules" :model="dataform" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
          <el-form-item label="牧场编号" prop="pastureNumber">
            <el-input
              ref="pastureNumber"
              v-model="dataform.pastureNumber"
            />
          </el-form-item>
          <el-form-item label="牧场名称" prop="name">
            <el-input
              ref="name"
              v-model="dataform.name"
            />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input
              ref="address"
              v-model="dataform.address"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            v-if="dialogStatus==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >
            确认新增
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
          <el-button @click="dialogFormVisible = false">
            关闭
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { isIntegerZero } from '@/utils/validate'
import enterToNext from '@/directive/enterToNext' // enterToNext directive
import { PostDataByName, GetDataByName } from '@/api/common'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'Productclass',
  components: { Pagination },
  directives: { waves, enterToNext },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      requestParam: {
        name: 'createapisql',
        params: []
      },
      dataform: {
        productclass: '',
        id: '',
        sort: '',
        enable: ''
      },
      getdataListParm: { name: 'getPastureList',
        offset: 1,
        pagecount: 10,
        params: [] },
      rules: {
        productclass: [{ type: 'string', required: true, message: '产品分类名称必填', trigger: 'change' }],
        sort: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' }
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
        }, 0.5 * 1000)
      })
    },

    resetRequestParam() {
      this.dataform.productclass = ''
      this.dataform.id = ''
      this.dataform.sort = '0'
      this.dataform.enable = '1'
    },
    handleCreate() {
      this.resetRequestParam()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.productclass.focus()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'insertPasture'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.pastureNumber
          this.requestParam.params[1] = this.dataform.name
          this.requestParam.params[2] = this.dataform.address
          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.dialogFormVisible = false
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'insertPasture'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.pastureNumber
          this.requestParam.params[1] = this.dataform.name
          this.requestParam.params[2] = this.dataform.address
          PostDataByName(this.requestParam).then(() => {
            this.$nextTick(() => {
              this.$refs['productclass'].focus()
            })
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
      this.dataform.id = row.id
      this.dataform.pastureNumber = row.pastureNumber
      this.dataform.name = row.name
      this.dataform.address = row.address
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs['productclass'].focus()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'updateProductclass'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.pastureNumber
          this.requestParam.params[1] = this.dataform.name
          this.requestParam.params[2] = this.dataform.address
          this.requestParam.params[3] = this.dataform.id
          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.resetRequestParam()
            this.dialogFormVisible = false
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
      this.requestParam.name = 'updatePasture'
      this.requestParam.params = []
      this.requestParam.params[0] = row.pastureNumber
      this.requestParam.params[1] = row.name
      this.requestParam.params[2] = row.address
      this.requestParam.params[3] = row.id
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
      MessageBox.confirm('分类名称：' + row.productclass, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestParam.name = 'deletePasture'
        this.requestParam.params = []
        this.requestParam.params[0] = row.id
        PostDataByName(this.requestParam).then(() => {
          this.getList()
          this.resetRequestParam()
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    }
  }
}
</script>
