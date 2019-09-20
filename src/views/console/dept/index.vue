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
        <el-table-column label="部门名称" header-align="center" width="250px">
          <template slot-scope="scope">
            <span>{{ scope.row.deptname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="150px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="顺序" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否牧场" min-width="80px" header-align="center" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isPasture"
              :active-value="1"
              :inactive-value="0"
              @change="handleEnableChange(scope.$index, scope.row)"
            />
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

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form ref="dataForm" :rules="rules" :model="deptform" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item v-if="parentDeptVisible" label="上级部门" prop="parentid">
            <tree-select
              :height="280"
              :width="200"
              size="small"
              :data="parentDept"
              :default-props="defaultProps"
              :node-key="nodeKey"
              :checked-keys="defaultCheckedKeys"
              @popoverHide="popoverHide"
            />
          </el-form-item>
          <el-form-item label="部门名称" prop="deptname">
            <el-input
              ref="deptname"
              v-model="deptform.deptname"
              @keyup.enter.native="deptenter"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              ref="remark"
              v-model="deptform.remark"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="顺序" prop="sort">
            <el-input
              ref="sort"
              v-model="deptform.sort"
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
  </div>
</template>

<script>
import TreeSelect from '@/components/TreeSelect'
import waves from '@/directive/waves' // waves directive
import { isIntegerZero } from '@/utils/validate'
import { PostDataByName, getRecuData } from '@/api/common'
import { MessageBox } from 'element-ui'
export default {
  name: 'Dept',
  components: { TreeSelect },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [{ 'deptname': '公司', 'id': 1, 'parentid': -1, 'remark': '' }],
      parentDept: [],
      listLoading: true,
      requestParam: {
        name: 'createdept',
        params: []
      },
      deptform: {
        id: '',
        deptname: '',
        remark: '',
        parentid: '',
        sort: '',
        enable: ''
      },
      getDeptListParm: { name: 'getdeptlistrecu',
        idname: 'id',
        params: [-1] },
      getDeptParm: { name: 'getdeptrecu',
        idname: 'value',
        params: [-1] },
      rules: {
        deptname: [{ type: 'string', required: true, message: '部门名称必填', trigger: 'blur' }],
        sort: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible: false,
      parentDeptVisible: true,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rowStyle: { maxHeight: 40 + 'px', height: 40 + 'px' },
      cellStyle: { padding: 0 + 'px' },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      nodeKey: 'value',
      defaultCheckedKeys: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    popoverHide(checkedIds, checkedData) {
      this.deptform.parentid = checkedIds
    },
    deptenter() {
      this.$nextTick(() => {
        this.$refs['remark'].focus()
      })
    },
    getList() {
      this.listLoading = true
      getRecuData(this.getDeptListParm).then(response => {
        this.list = response.data
        this.getDeptList()
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getDeptList() {
      getRecuData(this.getDeptParm).then(response => {
        this.parentDept = response.data
      })
    },
    resetRequestParam() {
      this.requestParam = {
        name: 'createdept',
        params: []
      }
      this.deptform.id = ''
      this.deptform.parentid = ''
      this.deptform.deptname = ''
      this.deptform.remark = ''
      this.deptform.sort = '0'
      this.deptform.enable = '1'
      this.deptform.isPasture = '0'
    },
    handleCreate() {
      this.resetRequestParam()
      this.dialogStatus = 'create'
      this.parentDeptVisible = true
      this.dialogFormVisible = true
      if (this.list.length > 0) {
        this.defaultCheckedKeys = [this.list[0].id]
        this.deptform.parentid = this.list[0].id
      } else {
        this.deptform.parentid = -1
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.deptname.focus()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'createdept'
          this.requestParam.params = []
          this.requestParam.params[0] = this.deptform.parentid
          this.requestParam.params[1] = this.deptform.deptname
          this.requestParam.params[2] = this.deptform.remark
          this.requestParam.params[3] = this.deptform.sort
          this.requestParam.params[4] = this.deptform.enable
          this.requestParam.params[5] = this.deptform.isPasture

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
          this.requestParam.name = 'createdept'
          this.requestParam.params = []
          this.requestParam.params[0] = this.deptform.parentid
          this.requestParam.params[1] = this.deptform.deptname
          this.requestParam.params[2] = this.deptform.remark
          this.requestParam.params[3] = this.deptform.sort
          this.requestParam.params[4] = this.deptform.enable
          this.requestParam.params[5] = this.deptform.isPasture

          PostDataByName(this.requestParam).then(() => {
            this.$nextTick(() => {
              this.$refs['deptname'].focus()
            })
            this.getList()
            this.requestParam = {
              name: 'createdept',
              params: []
            }
            this.deptform.id = ''
            this.deptform.deptname = ''
            this.deptform.remark = ''
            this.deptform.sort = '0'
            this.deptform.enable = '1'
            this.deptform.isPasture = '0'

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
      this.defaultCheckedKeys = [row.parentid]

      this.parentDeptVisible = row.parentid > 0
      this.deptform.id = row.id
      this.deptform.parentid = row.parentid
      this.deptform.deptname = row.deptname
      this.deptform.remark = row.remark
      this.deptform.sort = row.sort
      this.deptform.enable = row.enable
      this.deptform.isPasture = row.isPasture

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs['deptname'].focus()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'updatedept'
          this.requestParam.params = []
          this.requestParam.params[0] = this.deptform.parentid
          this.requestParam.params[1] = this.deptform.deptname
          this.requestParam.params[2] = this.deptform.remark
          this.requestParam.params[3] = this.deptform.sort
          this.requestParam.params[4] = this.deptform.enable
          this.requestParam.params[5] = this.deptform.isPasture
          this.requestParam.params[6] = this.deptform.id

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
        }
      })
    },
    handleEnableChange(index, row) {
      this.requestParam.name = 'updatedept'
      this.requestParam.params = []
      this.requestParam.params[0] = row.parentid
      this.requestParam.params[1] = row.deptname
      this.requestParam.params[2] = row.remark
      this.requestParam.params[3] = row.sort
      this.requestParam.params[4] = row.enable
      this.requestParam.params[5] = row.isPasture
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
      MessageBox.confirm('部门名称：' + row.deptname, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestParam.name = 'deletedept'
        this.requestParam.params = []
        this.requestParam.params[0] = row.id
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
    }
  }
}
</script>
