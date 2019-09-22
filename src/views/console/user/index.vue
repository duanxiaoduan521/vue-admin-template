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
        >
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
        <el-table-column
          label="用户名称"
          header-align="center"
          width="200px"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          min-width="150px"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.empname }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="部门"
          min-width="150px"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.deptname }}</span>
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
            <el-button
              type="warning"
              size="mini"
              @click="handleRole(row)"
            >
              角色
            </el-button>
            <el-button
              type="primary"
              size="mini"
              @click="handleUpdate(row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.status!='已删'"
              size="mini"
              type="danger"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
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

      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="dataform"
          label-position="left"
          label-width="100px"
          style="width: 600px; margin-left:50px;"
        >
          <el-form-item
            label="用户名"
            prop="username"
          >
            <el-input
              ref="username"
              v-model="dataform.username"
            />
          </el-form-item>
          <el-form-item
            label="职工名"
            prop="empid"
          >
            <el-select
              v-model="dataform.empid"
              style="width:500px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item in emplist"
                :key="item.id"
                :label="item.empname"
                :value="item.id"
              />

            </el-select>
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
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            v-if="dialogStatus==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >
            确认新增
          </el-button>
          <el-button
            type="primary"
            @click="dialogStatus==='create'?createData():updateData()"
          >
            确认
          </el-button>
          <el-button @click="dialogFormVisible = false">
            关闭
          </el-button>
        </div>
      </el-dialog>

      <el-dialog
        :title="textMap['role']"
        :visible.sync="dialogRoleVisible"
        :close-on-click-modal="false"
      >
        <el-form
          :rules="rules"
          label-position="left"
          label-width="100px"
          style="width: 600px; margin-left:50px;"
        >
          <el-form-item
            label="角色"
            prop="rolename"
          >
            <el-select
              v-model="selectedRole"
              style="width:500px;"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in rolelist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="updateRole()"
          >
            确认
          </el-button>
          <el-button @click="dialogRoleVisible = false">
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
import { PostDataByName, GetDataByName, GetDataByNames, UpdateDataRelation } from '@/api/common'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'User',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [{ sqlname: '', id: 0, sqlstr: '' }],
      total: 0,
      listLoading: true,
      requestParam: {
        name: 'createapisql',
        offset: 0,
        pagecount: 0,
        params: []
      },
      requestParams: [
        { name: 'getRoleall', offset: 0, pagecount: 0, params: [] },
        { name: 'getEmpall', offset: 0, pagecount: 0, params: [] }
      ],
      UpdateDataRelationParam: {
        name: '',
        dataname: '',
        datavalue: '',
        valuename: '',
        values: []
      },
      dataform: {
        username: '',
        fullname: '',
        empid: '',
        id: '',
        sort: '',
        enable: ''
      },
      rolelist: [],
      emplist: [],
      getdataListParm: {
        name: 'getuserall',
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        params: []
      },
      rules: {
        username: [
          {
            type: 'string',
            required: true,
            message: '用户名必填',
            trigger: 'change'
          }
        ],
        fullname: [
          {
            type: 'string',
            required: true,
            message: '全名必填',
            trigger: 'change'
          }
        ],
        sort: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogRoleVisible: false,
      selectedRole: '',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加',
        role: '选择角色'
      },
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    deptenter() {
      this.$nextTick(() => {
        this.$refs['remark'].focus()
      })
    },
    getList() {
      this.listLoading = true
      GetDataByNames(this.requestParams).then(response => {
        this.rolelist = response.data.getRoleall.list
        this.emplist = response.data.getEmpall.list
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
      })
    },

    resetRequestParam() {
      this.dataform.username = ''
      this.dataform.fullname = ''
      this.dataform.empid = ''
      this.dataform.id = ''
      this.dataform.sort = '0'
      this.dataform.enable = '1'
    },
    handleCreate() {
      this.resetRequestParam()

      if (this.list.length > 0) {
        this.defaultCheckedKeys = [this.list[0].id]
        this.deptform.deptid = this.list[0].id
      } else {
        this.deptform.deptid = -1
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'createUser'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.username
          this.requestParam.params[1] = this.dataform.empid
          this.requestParam.params[2] = this.dataform.sort
          this.requestParam.params[3] = this.dataform.enable
          PostDataByName(this.requestParam).then(() => {
            this.$nextTick(() => {
              this.getList()
            })

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
          this.requestParam.name = 'createUser'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.username
          this.requestParam.params[1] = this.dataform.empid
          this.requestParam.params[2] = this.dataform.sort
          this.requestParam.params[3] = this.dataform.enable
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
    handleRole(row) {
      this.requestParam.name = 'getRoleByUser'
      this.requestParam.params = []
      this.requestParam.params[0] = row.id
      this.requestParam.pagecount = 0
      this.requestParam.returntype = 'list'
      this.dataform.id = row.id
      this.dialogRoleVisible = true
      GetDataByName(this.requestParam).then(response => {
        this.selectedRole = response.data.lists.role_id
      })
    },
    updateRole() {
      this.UpdateDataRelationParam.name = 'user_role'
      this.UpdateDataRelationParam.dataname = 'user_id'
      this.UpdateDataRelationParam.datavalue = this.dataform.id
      this.UpdateDataRelationParam.valuename = 'role_id'
      this.UpdateDataRelationParam.values = this.selectedRole

      UpdateDataRelation(this.UpdateDataRelationParam).then(() => {
        this.dialogRoleVisible = false
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row) {
      this.dataform.id = row.id
      this.dataform.username = row.username
      this.dataform.empid = row.empid
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
          this.requestParam.name = 'updateUser'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.username
          this.requestParam.params[1] = this.dataform.empid
          this.requestParam.params[2] = this.dataform.sort
          this.requestParam.params[3] = this.dataform.enable
          this.requestParam.params[4] = this.dataform.id
          PostDataByName(this.requestParam).then(() => {
            this.$nextTick(() => {
              this.getList()
              this.resetRequestParam()
            })
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleEnableChange(index, row) {
      this.requestParam.name = 'updateUser'
      this.requestParam.params = []
      this.requestParam.params[0] = row.username
      this.requestParam.params[1] = row.empid
      this.requestParam.params[2] = row.sort
      this.requestParam.params[3] = row.enable
      this.requestParam.params[4] = row.id
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
        this.requestParam.name = 'deleteUser'
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
