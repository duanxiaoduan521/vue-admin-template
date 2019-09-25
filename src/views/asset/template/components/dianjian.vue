<template>

  <div class="app-container">
    <div style="margin-top: 10px">
      <svg-icon icon-class="marker" style="color: #606266" />
      <span class="font-small">点检模板</span>
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
      <el-table-column label="部位" header-align="center" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.partName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="检查内容" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examine }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标准" min-width="100px" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.standard }}</span>
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

    <!-- 弹出层新增or修改 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible_dj"
      :close-on-click-modal="false"
      style="width: 800px;margin:0 auto;"
    >
      <el-form
        ref="spotCheckForm"
        :rules="rules"
        :model="spotCheckForm"
        label-position="right"
        label-width="100px"
        style="width: 300px; margin-left:50px;"
      >
        <el-form-item label="部位：" prop="part">
          <el-select v-model="spotCheckForm.partId" placeholder="部位" class="filter-item">
            <el-option
              v-for="item in findAllPart"
              :key="item.id"
              :label="item.partName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="检查内容:" prop="examine">
          <el-input
            ref="examine"
            v-model="spotCheckForm.examine"
          />
        </el-form-item>
        <el-form-item label="标准:" prop="standard">
          <el-input
            ref="standard"
            v-model="spotCheckForm.standard"
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
        <el-button @click="dialogFormVisible_dj = false">关闭</el-button>
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
  name: 'Dianjian',
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
        parammaps: []
      },
      spotCheckForm: {
        id: '',
        partId: '',
        examine: '',
        standard: '',
        partName: ''
      },
      getdataListParm: { name: 'getSpotCheckTemplateList',
        offset: 1,
        pagecount: 8,
        params: [] },
      rules: {
        label: [{ type: 'string', required: true, message: '名称必填', trigger: 'change' }],
        value: [{ type: 'string', required: true, message: '只必填', trigger: 'change' }],
        orderby: [{ validator: isIntegerZero, trigger: 'blur' }]
      },
      dialogFormVisible_dj: false,
      parentDeptVisible: true,
      dialogStatus: '',

      // 2-3：下拉框请求后数据加入[]
      findAllPart: [],
      // 2-1.请求下拉框接口
      requestParams: [
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

    // 下拉框
    getDownList() {
      GetDataByNames(this.requestParams).then(response => {
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
      this.spotCheckForm.id = ''
      this.spotCheckForm.partId = ''
      this.spotCheckForm.examine = ''
      this.spotCheckForm.standard = ''
      this.spotCheckForm.assetTypeid = ''
    },
    handleCreate() {
      this.resetRequestParam()
      this.dialogStatus = 'create'

      this.dialogFormVisible_dj = true
      this.$nextTick(() => {
        this.getDownList()
      })
    },
    createData() {
      this.$refs['spotCheckForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'insertSpotCheckTemplate'

          this.spotCheckForm.assetTypeid = this.getdataListParm.params[0]
          this.requestParam.parammaps = this.spotCheckForm

          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.dialogFormVisible_dj = false
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
      this.$refs['spotCheckForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'insertSpotCheckTemplate'
          this.requestParam.parammaps = this.spotCheckForm

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
      this.spotCheckForm.id = row.id
      this.spotCheckForm.partId = row.partId
      this.spotCheckForm.examine = row.examine
      this.spotCheckForm.standard = row.standard
      this.dialogStatus = 'update'
      this.dialogFormVisible_dj = true
      this.$nextTick(() => {
        this.getDownList()
      })
    },
    updateData() {
      this.$refs['spotCheckForm'].validate((valid) => {
        if (valid) {
          this.requestParam.name = 'updateSpotCheckTemplate'
          this.requestParam.parammaps = {}

          this.requestParam.parammaps['partId'] = this.spotCheckForm.partId
          this.requestParam.parammaps['examine'] = this.spotCheckForm.examine
          this.requestParam.parammaps['standard'] = this.spotCheckForm.standard

          this.requestParam.parammaps['id'] = this.spotCheckForm.id

          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.resetRequestParam()
            this.dialogFormVisible_dj = false
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
      this.requestParam.name = 'updateSpotCheckTemplate'
      this.requestParam.parammaps = {}
      this.requestParam.parammaps['partId'] = this.spotCheckForm.partId
      this.requestParam.parammaps['examine'] = this.spotCheckForm.examine
      this.requestParam.parammaps['standard'] = this.spotCheckForm.standard
      this.requestParam.parammaps['id'] = this.spotCheckForm.id

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
      MessageBox.confirm('sql名称：' + row.examine, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestParam.name = 'deleteSpotCheckTemplate'
        this.requestParam.parammaps = {}
        this.requestParam.parammaps['id'] = row.id
        PostDataByName(this.requestParam).then(() => {
          this.getList()
          this.resetRequestParam()
          this.dialogFormVisible_dj = false
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
