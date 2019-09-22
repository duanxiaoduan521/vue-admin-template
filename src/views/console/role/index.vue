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
        <el-table-column
          label="角色名称"
          header-align="center"
          min-width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
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
        <el-table-column label="操作" header-align="center" align="center" width="260" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="warning" size="mini" @click="handleMenu(row)">
              菜单
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
      <pagination v-show="total>0" :total="total" :page.sync="getdataListParm.offset" :limit.sync="getdataListParm.pagecount" @pagination="getList" />

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form ref="dataForm" :rules="rules" :model="dataform" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
          <el-form-item label="角色名称" prop="name">
            <el-input
              ref="name"
              v-model="dataform.name"
            />
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

      <el-dialog :title="textMap['menu']" :visible.sync="dialogMenuVisible" :close-on-click-modal="false">
        <el-form :rules="rules" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
          <el-form-item label="菜单" prop="menuname">
            <tree-select
              :height="280"
              :width="200"
              size="small"
              multiple
              :data="parentMenu"
              :default-props="defaultProps"
              collapse-tags
              check-strictly
              :node-key="nodeKey"
              :checked-keys="defaultCheckedKeys"
              @popoverHide="popoverHide"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateMenu()">
            确认
          </el-button>
          <el-button @click="dialogMenuVisible = false">
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
import { PostDataByName, GetDataByName, UpdateDataRelation, getRecuData } from '@/api/common'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'Role',
  components: { Pagination, TreeSelect },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [{ 'sqlname': '', 'id': 0, 'sqlstr': '' }],
      parentMenu: [],
      total: 0,
      listLoading: true,
      requestParam: {
        name: 'createRole',
        offset: 0,
        pagecount: 0,
        params: []
      },
      UpdateDataRelationParam: {
        name: '',
        dataname: '',
        datavalue: '',
        valuename: '',
        values: ''
      },
      dataform: {
        id: '',
        name: '',
        selectMenus: [],
        sort: '',
        enable: ''
      },
      getdataListParm: { name: 'getRoleall',
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        params: [] },
      getMenuParm: { name: 'getmenuandbuttonrecu',
        idname: 'id',
        params: [-1] },
      rules: {
        name: [{ type: 'string', required: true, message: '名称必填', trigger: 'change' }],
        sort: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogMenuVisible: false,
      selectedMenu: '',
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加',
        munu: '授权菜单'
      },
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' },
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      nodeKey: 'id',
      defaultCheckedKeys: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    popoverHide(checkedIds, checkedData) {
      this.dataform.selectMenus = checkedIds
      this.selectedMenu = checkedIds
      this.UpdateDataRelationParam.values = checkedIds
    },
    getMenuList() {
      getRecuData(this.getMenuParm).then(response => {
        this.parentMenu = response.data
      })
    },
    getList() {
      this.listLoading = true
      GetDataByName(this.getdataListParm).then(response => {
        this.list = response.data.list
        if (response.data.total) {
          this.total = response.data.total
        }
        this.getMenuList()
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    resetRequestParam() {
      this.dataform.id = ''
      this.dataform.name = ''
      this.dataform.sort = '0'
      this.dataform.enable = '1'
    },
    handleCreate() {
      this.resetRequestParam()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.name.focus()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'createRole'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.name
          this.requestParam.params[1] = this.dataform.sort
          this.requestParam.params[2] = this.dataform.enable
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
          this.requestParam.name = 'createRole'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.name
          this.requestParam.params[1] = this.dataform.sort
          this.requestParam.params[2] = this.dataform.enable
          PostDataByName(this.requestParam).then(() => {
            this.$nextTick(() => {
              this.$refs['name'].focus()
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
    handleMenu(row) {
      this.requestParam.name = 'getMenuByRole'
      this.requestParam.params = []
      this.requestParam.params[0] = row.id
      this.requestParam.pagecount = 0
      this.requestParam.returntype = 'list'
      this.dataform.id = row.id
      this.dialogMenuVisible = true
      GetDataByName(this.requestParam).then(response => {
        this.selectedMenu = response.data.lists.menu_id
        this.defaultCheckedKeys = this.selectedMenu
        this.UpdateDataRelationParam.values = this.defaultCheckedKeys
      })
    },
    updateMenu() {
      this.UpdateDataRelationParam.name = 'role_menu'
      this.UpdateDataRelationParam.dataname = 'role_id'
      this.UpdateDataRelationParam.datavalue = this.dataform.id
      this.UpdateDataRelationParam.valuename = 'menu_id'
      this.UpdateDataRelationParam.values = this.selectedMenu

      UpdateDataRelation(this.UpdateDataRelationParam).then(() => {
        this.dialogMenuVisible = false
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
      this.dataform.name = row.name
      this.dataform.sort = row.sort
      this.dataform.enable = row.enable
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.name.focus()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'updateRole'
          this.requestParam.params = []
          this.requestParam.params[0] = this.dataform.name
          this.requestParam.params[1] = this.dataform.sort
          this.requestParam.params[2] = this.dataform.enable
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
      this.requestParam.name = 'updateRole'
      this.requestParam.params = []
      this.requestParam.params[0] = row.name
      this.requestParam.params[1] = row.sort
      this.requestParam.params[2] = row.enable
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
      MessageBox.confirm('名称：' + row.name, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestParam.name = 'deleteRole'
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
