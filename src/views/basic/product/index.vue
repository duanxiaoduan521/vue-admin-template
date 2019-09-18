<template>
  <div class="app-container">
    <div class="app-container">
      <div class="filter-container">
        <el-button
          class="filter-item"
          style="margin-left: 10px;"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >添加</el-button>
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
        <el-table-column label="产品分类" header-align="center" min-width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productclass }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" header-align="center" min-width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="型号" header-align="center" min-width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.model }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" header-align="center" min-width="150px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.spec }}</span>
          </template>
        </el-table-column>
        <el-table-column label="顺序" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column label="启用" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enable"
              :active-value="1"
              :inactive-value="0"
              @change="handleEnableChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="260"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
            <el-button
              v-if="row.status!='已删'"
              size="mini"
              type="danger"
              @click="handleDelete(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="getdataListParm.offset"
        :limit.sync="getdataListParm.pagecount"
        @pagination="getList"
      />

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form
          ref="dataForm"
          v-enterToNext="true"
          :rules="rules"
          :model="dataform"
          label-position="left"
          label-width="100px"
          style="width: 600px; margin-left:50px;"
        >
          <el-form-item label="产品分类" prop="productclassid">
            <el-select ref="productclassid" v-model="dataform.productclassid" placeholder="请选择">
              <el-option
                v-for="item in productlist"
                :key="item.id"
                :label="item.productclass"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="产品名称" prop="productname">
            <el-input ref="productname" v-model="dataform.productname" keyfocusto="2" />
          </el-form-item>
          <el-form-item label="型号" prop="model">
            <el-input ref="model" v-model="dataform.model" />
          </el-form-item>
          <el-form-item label="规格" prop="spec">
            <el-input ref="spec" v-model="dataform.spec" />
          </el-form-item>
          <el-form-item label="顺序" prop="sort">
            <el-input
              ref="sort"
              v-model="dataform.sort"
            />
          </el-form-item>
          <el-form-item label="启用" prop="enable">
            <el-switch
              ref="enable"
              v-model="dataform.enable"
              :active-value="1"
              :inactive-value="0"
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
          <el-button @click="dialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { isIntegerZero } from '@/utils/validate'
import enterToNext from '@/directive/enterToNext' // enterToNext directive
import { PostDataByName, GetDataByNames, GetDataByName } from '@/api/common'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'Product',
  components: { Pagination },
  directives: { waves, enterToNext },
  data() {
    return {
      tableKey: 0,
      list: [],
      productlist: [],
      total: 0,
      listLoading: true,
      requestParam: {
        name: 'createapisql',
        params: []
      },
      dataform: {
        productclassid: '',
        productname: '',
        spec: '',
        model: '',
        id: '',
        sort: '',
        enable: ''
      },
      requestParams: [
        { name: 'getProductclassEnable', offset: 0, pagecount: 0, params: [] }
      ],
      getdataListParm: {
        name: 'getProductAll',
        offset: 1,
        pagecount: 10,
        params: []
      },
      rules: {
        productclassid: [
          {
            required: true,
            message: '产品类别必填',
            trigger: ['blur', 'change']
          }],
        productname: [
          {
            required: true,
            message: '产品名称必填',
            trigger: 'blur'
          }
        ],
        sort: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rowStyle: { maxHeight: 40 + 'px', height: 40 + 'px' },
      cellStyle: { padding: 0 + 'px' }
    }
  },
  created() {
    this.getList()
    this.resetRequestParam()
  },
  methods: {
    getList() {
      this.listLoading = true
      GetDataByNames(this.requestParams).then(response => {
        this.productlist = response.data.getProductclassEnable.list
      })
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
      this.dataform.productclassid = ''
      this.dataform.productname = ''
      this.dataform.model = ''
      this.dataform.spec = '默认'
      this.dataform.id = ''
      this.dataform.sort = '0'
      this.dataform.enable = '1'
    },
    handleCreate() {
      this.resetRequestParam()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs.productclassid.focus()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'insertProduct'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.productclassid
          this.requestParam.params[1] = this.dataform.productname
          this.requestParam.params[2] = this.dataform.model
          this.requestParam.params[3] = this.dataform.spec
          this.requestParam.params[4] = this.dataform.sort
          this.requestParam.params[5] = this.dataform.enable
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
        } else {
          setTimeout(() => {
            var isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input').focus()
          }, 100)
          return false
        }
      })
    },
    createData_again() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'insertProduct'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.productclassid
          this.requestParam.params[1] = this.dataform.productname
          this.requestParam.params[2] = this.dataform.model
          this.requestParam.params[3] = this.dataform.spec
          this.requestParam.params[4] = this.dataform.sort
          this.requestParam.params[5] = this.dataform.enable
          PostDataByName(this.requestParam).then(() => {
            this.$nextTick(() => {
              this.getList()
              MessageBox.confirm('是否继续新增数据？', '继续？', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$refs['dataForm'].resetFields()
                this.$refs.productclassid.focus()
              }).catch(() => {
                this.dialogFormVisible = false
                this.$message({
                  type: 'info',
                  message: '已取消继续新增数据'
                })
              })
            })
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          setTimeout(() => {
            var isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input').focus()
          }, 100)
          return false
        }
      })
    },
    handleUpdate(row) {
      this.dataform.id = row.id
      this.dataform.productclassid = row.productclassid
      this.dataform.productname = row.productname
      this.dataform.model = row.model
      this.dataform.spec = row.spec
      this.dataform.sort = row.sort
      this.dataform.enable = row.enable
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'updateProduct'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.productclassid
          this.requestParam.params[1] = this.dataform.productname
          this.requestParam.params[2] = this.dataform.model
          this.requestParam.params[3] = this.dataform.spec
          this.requestParam.params[4] = this.dataform.sort
          this.requestParam.params[5] = this.dataform.enable
          this.requestParam.params[6] = this.dataform.id
          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          setTimeout(() => {
            var isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input').focus()
          }, 100)
          return false
        }
      })
    },
    handleEnableChange(index, row) {
      this.requestParam.name = 'updateProduct'
      this.requestParam.params = []
      this.requestParam.params[0] = row.productclassid
      this.requestParam.params[1] = row.productname
      this.requestParam.params[2] = row.model
      this.requestParam.params[3] = row.spec
      this.requestParam.params[4] = row.sort
      this.requestParam.params[5] = row.enable
      this.requestParam.params[6] = row.id
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
        this.requestParam.name = 'deleteProduct'
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
