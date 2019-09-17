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
        <el-table-column label="姓名" min-width="150px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.empname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" min-width="150px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.deptname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" min-width="150px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.tel }}</span>
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
          <el-form-item label="用户名" prop="empname">
            <el-input ref="empname" v-model="dataform.empname" />
          </el-form-item>
          <el-form-item label="部门" prop="deptid">
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
          <el-form-item label="电话号码" prop="tel">
            <el-input ref="tel" v-model="dataform.tel" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input ref="remark" v-model="dataform.remark" />
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
import TreeSelect from '@/components/TreeSelect'
import waves from '@/directive/waves' // waves directive
import { isIntegerZero } from '@/validator'
import enterToNext from '@/directive/enterToNext' // enterToNext directive
import { PostDataByName, GetDataByName, getRecuData } from '@/api/common'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'

export default {
  name: 'Emp',
  components: { Pagination, TreeSelect },
  directives: { waves, enterToNext },
  data() {
    return {
      tableKey: 0,
      list: [{ sqlname: '', id: 0, sqlstr: '' }],
      parentDept: [],
      total: 0,
      listLoading: true,
      requestParam: {
        name: 'createapisql',
        offset: 0,
        pagecount: 0,
        params: []
      },
      dataform: {
        empname: '',
        deptname: '',
        deptid: '',
        tel: '',
        remark: '',
        id: '',
        sort: '',
        enable: ''
      },
      getDeptParm: { name: 'getdeptrecu', idname: 'value', params: [-1] },
      getdataListParm: {
        name: 'getEmpAll',
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        params: []
      },
      rules: {
        empname: [
          {
            type: 'string',
            required: true,
            message: '员工名必填',
            trigger: 'change'
          }
        ],
        sort: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible: false,
      selectedRole: '',
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
      this.dataform.deptid = checkedIds
    },
    deptenter() {
      this.$nextTick(() => {
        this.$refs['remark'].focus()
      })
    },
    getList() {
      this.listLoading = true
      GetDataByName(this.getdataListParm).then(response => {
        this.list = response.data.list
        if (response.data.total) {
          this.total = response.data.total
        }
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
      this.dataform.empname = ''
      this.dataform.deptname = ''
      this.dataform.deptid = ''
      this.dataform.tel = ''
      this.dataform.remark = ''
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
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'createEmp'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.empname
          this.requestParam.params[1] = this.dataform.deptid
          this.requestParam.params[2] = this.dataform.tel
          this.requestParam.params[3] = this.dataform.remark
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
        }
      })
    },
    createData_again() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'createEmp'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.empname
          this.requestParam.params[1] = this.dataform.deptid
          this.requestParam.params[2] = this.dataform.tel
          this.requestParam.params[3] = this.dataform.remark
          this.requestParam.params[4] = this.dataform.sort
          this.requestParam.params[5] = this.dataform.enable
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
      this.defaultCheckedKeys = [row.deptid]
      this.dataform.empname = row.empname
      this.dataform.deptname = row.deptname
      this.dataform.deptid = row.deptid
      this.dataform.tel = row.tel
      this.dataform.remark = row.remark
      this.dataform.id = row.id
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
          this.requestParam.name = 'updateEmp'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.empname
          this.requestParam.params[1] = this.dataform.deptid
          this.requestParam.params[2] = this.dataform.tel
          this.requestParam.params[3] = this.dataform.remark
          this.requestParam.params[4] = this.dataform.sort
          this.requestParam.params[5] = this.dataform.enable
          this.requestParam.params[6] = this.dataform.id
          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.resetRequestParam()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleEnableChange(index, row) {
      this.requestParam.name = 'updateEmp'
      this.requestParam.params = []
      this.requestParam.params[0] = row.empname
      this.requestParam.params[1] = row.deptid
      this.requestParam.params[2] = row.tel
      this.requestParam.params[3] = row.remark
      this.requestParam.params[4] = row.sort
      this.requestParam.params[5] = row.enable
      this.requestParam.params[6] = row.deptid
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
      MessageBox.confirm('sql名称：' + row.sqlname, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestParam.name = 'deleteEmp'
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
