<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="getdataListParm.parammaps.begindate"
        type="date"
        placeholder="开始日期"
        style="width: 140px;"
        class="filter-item"
      />

      <el-date-picker
        v-model="getdataListParm.parammaps.enddate"
        type="date"
        placeholder="结束日期"
        style="width: 140px;"
        class="filter-item"
      />
      <el-input v-model="getdataListParm.parammaps.companygroup" placeholder="集团" clearable class="filter-item" style="width: 130px" />
      <el-input v-model="getdataListParm.parammaps.customname" placeholder="客户名称" clearable style="width: 90px" class="filter-item" />
      <el-input v-model="getdataListParm.parammaps.visiter" placeholder="拜访人" clearable style="width: 90px" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
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
      @sort-change="sortChange"
    >
      <el-table-column label="客户编号" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.customcode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="集团" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.companygroup }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拜访日期" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.visitdate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="拜访人" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.visiter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被拜访人" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.receiver }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='已删'" size="mini" type="danger" @click="handleModifyStatus(row,'已删')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="getdataListParm.offset" :limit.sync="getdataListParm.pagecount" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">

        <el-form-item label="时间" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="请选择时间" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>

        <el-form-item label="重要性">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="点评">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="阅读统计">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv, createArticle, updateArticle } from '@/api/article'
import { GetDataByName, GetDataByNames } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'Visit',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,

      getdataListParm: {
        name: 'getVisitList',
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          customname: '',
          companygroup: '',
          visiter: '',
          begindate: '',
          enddate: '' }
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: '发布'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: '必填类型', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: '必填时间', trigger: 'change' }],
        title: [{ required: true, message: '必填标题', trigger: 'blur' }]
      },
      rowStyle: { maxHeight: 10 + 'px', height: 10 + 'px' },
      cellStyle: { padding: 0 + 'px' },
      downloadLoading: false
    }
  },
  computed: {
    enddateDefault() {
      var date = new Date()
      return date
    },
    begindateDefault() {
      var date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
      return date
    }
  },
  created() {
    this.getList()
  },

  mounted() {
    // 初始化查询，默认为前一天
    this.getdataListParm.parammaps.begindate = this.begindateDefault
    this.getdataListParm.parammaps.enddate = this.enddateDefault
  },

  methods: {
    getList() {
      this.listLoading = true
      GetDataByName(this.getdataListParm).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    handleFilter() {
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: '发布',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
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
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
