<template>
  <div class="app-container">
    <div style="margin-top: 20px">
      <svg-icon icon-class="marker" style="color: #606266" />
      <span class="font-small">保养模板</span>
      <el-button class="filter-item" style="margin-left: 10px;float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderby }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行动作" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderby }}</span>
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
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import enterToNext from '@/directive/enterToNext' // enterToNext directive
import { PostDataByName, GetDataByName } from '@/api/common'
import { isIntegerZero } from '@/utils/validate'
import { MessageBox } from 'element-ui'
export default {
  name: 'Buwei',
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
      total: 0,
      listLoading: true,
      requestParam: {
        name: '',
        params: []
      },
      deptform: {
        partName: '',
        note: ''
      },
      getdataListParm: { name: 'getPartList',
        offset: 1,
        pagecount: 8,
        params: [] },
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

  watch: {
    assetTypeid(val) {
      this.getdataListParm.params = [this.assetTypeid]
      this.getList()
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
      this.deptform.id = ''
      this.deptform.partName = ''
      this.deptform.note = ''
      this.deptform.assetTypeId = ''
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
          this.requestParam.name = 'insertPart'
          this.requestParam.params = []
          this.requestParam.params[0] = this.deptform.partName
          this.requestParam.params[1] = this.deptform.note
          this.requestParam.params[2] = this.dictid
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
          this.requestParam.name = 'insertPart'
          this.requestParam.params = []
          this.requestParam.params[0] = this.deptform.partName
          this.requestParam.params[1] = this.deptform.note
          this.requestParam.params[2] = this.dictid
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
      this.deptform.partName = row.partName
      this.deptform.note = row.note
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
          this.requestParam.params[0] = this.deptform.partName
          this.requestParam.params[1] = this.deptform.note
          this.requestParam.params[2] = this.dictid
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
      this.requestParam.name = 'updatePart'
      this.requestParam.params = []
      this.requestParam.params[0] = row.partName
      this.requestParam.params[1] = row.note
      this.requestParam.params[2] = row.id
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
        this.requestParam.name = 'deletePart'
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
