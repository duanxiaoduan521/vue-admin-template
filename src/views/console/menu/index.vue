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
        <el-table-column label="菜单名称" header-align="center" width="180px">
          <template slot-scope="scope">
            <el-tag :type="scope.row.menutype | menutypeFilter" size="small">
              <span>{{ scope.row.name }}</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标题" width="140px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="路径" width="100px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.path }}</span>
          </template>
        </el-table-column>
        <el-table-column label="组件" min-width="150px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.component }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图标" width="100px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.icon }}</span>
          </template>
        </el-table-column>
        <el-table-column label="重定向" width="100px" header-align="center" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.redirect }}</span>
          </template>
        </el-table-column>
        <el-table-column label="顺序" width="100px" header-align="center" align="center">
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
        <el-form ref="deptform" :rules="rules" :model="deptform" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
          <el-form-item label="上级菜单" prop="parentid">
            <tree-select
              :height="280"
              :width="200"
              size="small"
              :data="parent"
              :default-props="defaultProps"
              clearable
              :node-key="nodeKey"
              :checked-keys="defaultCheckedKeys"
              @popoverHide="popoverHide"
            />
          </el-form-item>
          <el-form-item label="菜单名称" prop="name">
            <el-input
              ref="name"
              v-model="deptform.name"
            />
          </el-form-item>
          <el-form-item label="类型" prop="menutype">

            <el-radio-group ref="menutype" v-model="deptform.menutype" @change="menutypechange">
              <el-radio label="menu">菜单</el-radio>
              <el-radio label="button">按钮</el-radio>
            </el-radio-group>

          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input
              ref="title"
              v-model="deptform.title"
            />
          </el-form-item>
          <el-form-item label="路径" prop="path">
            <el-input
              ref="path"
              v-model="deptform.path"
            />
          </el-form-item>
          <el-form-item v-if="deptform.menutype==='menu'" label="组件" prop="component">
            <el-input
              ref="component"
              v-model="deptform.component"
            />
          </el-form-item>
          <el-form-item v-if="deptform.menutype==='menu'" label="图标" prop="icon">
            <el-input
              ref="icon"
              v-model="deptform.icon"
            />
          </el-form-item>
          <el-form-item v-if="deptform.menutype==='menu'" label="重定向" prop="redirect">
            <el-input
              ref="redirect"
              v-model="deptform.redirect"
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
import { isIntegerZero } from '@/validator'
import { PostDataByName, getRecuData } from '@/api/common'
import { MessageBox } from 'element-ui'
export default {
  name: 'Menu',
  components: { TreeSelect },
  directives: { waves },

  filters: {
    menutypeFilter(menutype) {
      const menutypeMap = {
        menu: '',
        button: 'warning'
      }
      return menutypeMap[menutype]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [{ 'deptname': '公司', 'id': 1, 'parentid': -1, 'remark': '' }],
      parent: [],
      parentmenu: [],
      parentButton: [],
      listLoading: true,
      requestParam: {
        name: 'createdept',
        params: []
      },
      deptform: {
        id: '',
        name: '',
        title: '',
        path: '',
        component: '',
        icon: '',
        redirect: '',
        sort: '',
        parnetid: '',
        menutype: '',
        enable: ''
      },
      getListParm: { name: 'getMenuAndButtonRecu',
        idname: 'id',
        params: [-1] },
      getRecuListParm: { name: 'getMenuListRecu',
        idname: 'id',
        parammaps: { id: -2 }
      },
      getRecuListBParm: { name: 'getMenuListBRecu',
        idname: 'id',
        parammaps: { id: -2 }
      },
      rules: {
        name: [{ type: 'string', required: true, message: '菜单名称必填', trigger: 'change' }],
        title: [{ type: 'string', required: true, message: '菜单标题必填', trigger: 'change' }],
        path: [{ type: 'string', required: true, message: '路径必填', trigger: 'change' }],
        component: [{ type: 'string', required: true, message: '组件必填', trigger: 'change' }],
        sort: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rowStyle: { maxHeight: 40 + 'px', height: 40 + 'px' },
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
      this.deptform.parentid = checkedIds
    },
    menutypechange() {
      if (this.deptform.menutype === 'menu') {
        this.parent = this.parentmenu
      } else { this.parent = this.parentButton }
    },
    getList() {
      this.listLoading = true
      getRecuData(this.getListParm).then(response => {
        this.list = response.data

        this.getDownList()
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getDownList() {
      getRecuData(this.getRecuListParm).then(response => {
        this.parentmenu = response.data
        getRecuData(this.getRecuListBParm).then(response => {
          this.parentButton = response.data
        })
      })
    },
    refreshDownList() {
      for (var val of this.parentmenu) {
        this.parent = []
        if (val.redirect === 'noredirect' && this.deptform.menutype === 'menu') {
          this.parent.push({ id: val.id, title: val.title, parentid: val.parentid })
        } else if (this.deptform.menutype === 'button') {
          this.parent.push({ id: val.id, title: val.title, parentid: val.parentid })
        }
      }
    },
    resetRequestParam() {
      this.deptform.id = ''
      this.deptform.parentid = '-1'
      this.deptform.name = ''
      this.deptform.title = ''
      this.deptform.path = ''
      this.deptform.component = 'Layout'
      this.deptform.icon = ''
      this.deptform.redirect = ''
      this.deptform.sort = '0'
      this.deptform.menutype = ''
      this.deptform.enable = '1'
    },
    handleCreate() {
      this.resetRequestParam()
      this.dialogStatus = 'create'
      this.parent = this.parentmenu
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['deptform'].clearValidate()
        this.$refs.name.focus()
      })
    },
    createData() {
      this.$refs['deptform'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'createMenu'
          this.requestParam.params = []
          if (this.deptform.parentid === '') this.deptform.parentid = '-1'
          this.requestParam.params[0] = this.deptform.parentid
          this.requestParam.params[1] = this.deptform.name
          this.requestParam.params[2] = this.deptform.title
          this.requestParam.params[3] = this.deptform.path
          this.requestParam.params[4] = this.deptform.component
          this.requestParam.params[5] = this.deptform.icon
          this.requestParam.params[6] = this.deptform.redirect
          this.requestParam.params[7] = this.deptform.sort
          this.requestParam.params[8] = this.deptform.menutype
          this.requestParam.params[9] = this.deptform.enable
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
      this.$refs['deptform'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'createMenu'
          this.requestParam.params = []

          this.requestParam.params[0] = this.deptform.parentid
          this.requestParam.params[1] = this.deptform.name
          this.requestParam.params[2] = this.deptform.title
          this.requestParam.params[3] = this.deptform.path
          this.requestParam.params[4] = this.deptform.component
          this.requestParam.params[5] = this.deptform.icon
          this.requestParam.params[6] = this.deptform.redirect
          this.requestParam.params[7] = this.deptform.sort
          this.requestParam.params[8] = this.deptform.menutype
          this.requestParam.params[9] = this.deptform.enable
          PostDataByName(this.requestParam).then(() => {
            this.$nextTick(() => {
              this.$refs['name'].focus()
            })
            this.getList()
            this.requestParam = {
              name: 'createMenu',
              params: []
            }
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
      this.defaultCheckedKeys = [row.parentid]
      this.deptform.parentid = row.parentid
      this.deptform.name = row.name
      this.deptform.title = row.title
      this.deptform.path = row.path
      this.deptform.component = row.component
      this.deptform.icon = row.icon
      this.deptform.redirect = row.redirect
      this.deptform.sort = row.sort
      this.deptform.id = row.id
      this.deptform.menutype = row.menutype
      this.deptform.enable = row.enable
      this.dialogStatus = 'update'
      this.menutypechange()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['deptform'].clearValidate()
        this.$refs['name'].focus()
      })
    },
    updateData() {
      this.$refs['deptform'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'updateMenu'
          this.requestParam.params = []
          this.requestParam.params[0] = this.deptform.parentid
          this.requestParam.params[1] = this.deptform.name
          this.requestParam.params[2] = this.deptform.title
          this.requestParam.params[3] = this.deptform.path
          this.requestParam.params[4] = this.deptform.component
          this.requestParam.params[5] = this.deptform.icon
          this.requestParam.params[6] = this.deptform.redirect
          this.requestParam.params[7] = this.deptform.sort
          this.requestParam.params[8] = this.deptform.menutype
          this.requestParam.params[9] = this.deptform.enable
          this.requestParam.params[10] = this.deptform.id
          console.log(this.requestParam)
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
      this.requestParam.name = 'updateMenu'
      this.requestParam.params = []
      this.requestParam.params[0] = row.parentid
      this.requestParam.params[1] = row.name
      this.requestParam.params[2] = row.title
      this.requestParam.params[3] = row.path
      this.requestParam.params[4] = row.component
      this.requestParam.params[5] = row.icon
      this.requestParam.params[6] = row.redirect
      this.requestParam.params[7] = row.sort
      this.requestParam.params[8] = row.menutype
      this.requestParam.params[9] = row.enable
      this.requestParam.params[10] = row.id
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
      MessageBox.confirm('菜单名称：' + row.name, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestParam.name = 'deleteMenu'
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
