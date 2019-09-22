<template>

  <el-row :gutter="5" style="margin-top:5px;margin-left:5px;">
    <el-col :span="5">
      <el-card class="box-card">
        <div slot="header" class="clearfix" style="text-align: right; ">
          <el-row :gutter="2" style="margin-top:5px; margin-left:5px;">
            <el-col :span="12" style="text-align: left; vertical-align:middle; font-size: 20px">  <span>字典分类 </span></el-col>
            <el-col :span="6"> <el-col :span="6">  <el-button type="warning" icon="el-icon-edit" size="mini" @click="jump" /></el-col>
            </el-col>
            <el-col :span="6">  <el-button type="primary" icon="el-icon-refresh" size="mini" /></el-col>
          </el-row>
        </div>
        <div class="component-item">
          <el-tree
            ref="tree"
            class="filter-tree"
            :data="parent"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-card>
    </el-col>
    <el-col :span="19">
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
          <el-table-column label="名称" header-align="center" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.label }}</span>
            </template>
          </el-table-column>
          <el-table-column label="值" min-width="150px" header-align="center" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.value }}</span>
            </template>
          </el-table-column>
          <el-table-column label="顺序" min-width="150px" header-align="center" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.orderby }}</span>
            </template>
          </el-table-column>
          <el-table-column label="启用" min-width="150px" header-align="center" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enable"
                :active-value="1"
                :inactive-value="0"
                @change="handleEnableChange(scope.$index, scope.row)"
              />
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
          <el-form
            ref="dataForm"
            v-enterToNext="true"
            :rules="rules"
            :model="deptform"
            label-position="left"
            label-width="100px"
            style="width: 600px; margin-left:50px;"
          >
            <el-form-item label="名称" prop="label">
              <el-input
                ref="label"
                v-model="deptform.label"
              />
            </el-form-item>
            <el-form-item label="值" prop="value">
              <el-input
                ref="value"
                v-model="deptform.value"
              />
            </el-form-item>
            <el-form-item label="顺序" prop="orderby">
              <el-input
                ref="orderby"
                v-model="deptform.orderby"
              />
            </el-form-item>
            <el-form-item label="启用" prop="enable">
              <el-switch
                ref="enable"
                v-model="deptform.enable"
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
    </el-col>
  </el-row>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import enterToNext from '@/directive/enterToNext' // enterToNext directive
import { PostDataByName, GetDataByName, getRecuData } from '@/api/common'
import { isIntegerZero } from '@/utils/validate'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'Dict',
  components: { Pagination },
  directives: { waves, enterToNext },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dictid: 0,
      list: [],
      total: 0,
      listLoading: true,
      requestParam: {
        name: '',
        params: []
      },
      deptform: {
        label: '',
        value: '',
        orderby: '',
        enable: '',
        pid: ''
      },
      getdataListParm: { name: 'getDictList',
        offset: 1,
        pagecount: 8,
        params: [] },
      getRecuListParm: { name: 'getDictclass',
        idname: 'id',
        params: [-1] },
      rules: {
        label: [{ type: 'string', required: true, message: '名称必填', trigger: 'change' }],
        value: [{ type: 'string', required: true, message: '只必填', trigger: 'change' }],
        orderby: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible: false,
      parentDeptVisible: true,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      parent: [],
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    jump() {
      this.$router.push('/console/menu')
    // 传递的参数用{{ $route.query.goodsId }}获取
    //  this.$router.push({ path: '/cart?goodsId=12' })
    // this.$router.go(-2)
    // 后退两步
    },

    handleNodeClick(data) {
      if (data.children.length === 0) {
        this.listLoading = true
        this.dictid = data.id
        this.getdataListParm.params = [data.id, data.id]
        GetDataByName(this.getdataListParm).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 100)
        })
      }
    },
    getDownList() {
      getRecuData(this.getRecuListParm).then(response => {
        this.parent = response.data
      })
    },
    getList() {
      this.listLoading = true
      this.getDownList()
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
      this.deptform.id = ''
      this.deptform.pid = ''
      this.deptform.label = ''
      this.deptform.value = ''
      this.deptform.orderby = '0'
      this.deptform.enable = '1'
    },
    handleCreate() {
      this.resetRequestParam()
      this.dialogStatus = 'create'
      this.deptform.orderby = '0'
      this.deptform.enable = 1
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs['label'].focus()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'insertDictList'
          this.requestParam.params = []
          this.requestParam.params[0] = this.deptform.label
          this.requestParam.params[1] = this.deptform.value
          this.requestParam.params[2] = this.deptform.orderby
          this.requestParam.params[3] = this.deptform.enable
          this.requestParam.params[4] = this.dictid
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
          this.requestParam.name = 'insertDictList'
          this.requestParam.params = []
          this.requestParam.params[0] = this.deptform.label
          this.requestParam.params[1] = this.deptform.value
          this.requestParam.params[2] = this.deptform.orderby
          this.requestParam.params[3] = this.deptform.enable
          this.requestParam.params[4] = this.dictid
          PostDataByName(this.requestParam).then(() => {
            this.$nextTick(() => {
              this.$refs['label'].focus()
            })
            this.getList()
            this.resetRequestParam()
            this.deptform.orderby = '0'
            this.deptform.enable = 1
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
      this.deptform.id = row.id
      this.deptform.label = row.label
      this.deptform.value = row.value
      this.deptform.orderby = row.orderby
      this.deptform.enable = row.enable
      this.deptform.pid = row.pid
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs['label'].focus()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'updateDictList'
          this.requestParam.params = []
          this.requestParam.params[0] = this.deptform.label
          this.requestParam.params[1] = this.deptform.value
          this.requestParam.params[2] = this.deptform.orderby
          this.requestParam.params[3] = this.deptform.enable
          this.requestParam.params[4] = this.dictid
          this.requestParam.params[5] = this.deptform.id
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
      this.requestParam.name = 'updateDictList'
      this.requestParam.params = []
      this.requestParam.params[0] = row.label
      this.requestParam.params[1] = row.value
      this.requestParam.params[2] = row.orderby
      this.requestParam.params[3] = row.enable
      this.requestParam.params[4] = this.dictid
      this.requestParam.params[5] = row.id
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
      MessageBox.confirm('sql名称：' + row.label, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestParam.name = 'deleteDictList'
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
