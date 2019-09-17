<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="getdataListParm.parammaps.assetNumber"
        placeholder="资产编号"
        style="width: 140px;"
        class="filter-item"
      />
      <el-input
        v-model="getdataListParm.parammaps.assetName"
        placeholder="资产名称"
        style="width: 140px;"
        class="filter-item"
      />
      <el-input
        v-model="getdataListParm.parammaps.pastureName"
        placeholder="牧场"
        clearable
        class="filter-item"
        style="width: 130px"
      />
      <el-select v-model="value" placeholder="状态" class="filter-item">
        <el-option
          v-for="item in filterstatusoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
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
      <el-table-column label="设备编号" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.assetNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="牧场设备编号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.equipmentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.equipmentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="牧场" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.providerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="财务编号" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.financeNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="责任人" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.purpose }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备卡片" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.assetcard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button
            v-if="row.status!='已删'"
            size="mini"
            type="danger"
            @click="handleModifyStatus(row,'已删')"
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="temp"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="资产编号" prop="assetNumber">
          <el-input ref="assetNumber" v-model="temp.assetNumber" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input
            ref="equipmentName"
            v-model="temp.equipmentName"
            @keyup.enter.native="deptenter"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" placeholder="状态" class="filter-item">
            <el-option
              v-for="item in filterstatusoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input
            ref="specification"
            v-model="temp.specification"
            @keyup.enter.native="deptenter"
          />
        </el-form-item>
        <el-form-item label="品牌" prop="proId">
          <el-input ref="proId" v-model="temp.proId" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="用途" prop="deptname">
          <el-input ref="deptname" v-model="temp.purpose" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="牧场" prop="pastureId">
          <el-input ref="pastureId" v-model="temp.pastureId" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-input ref="departmentId" v-model="temp.departmentId" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="负责人" prop="employeeId">
          <el-input ref="employeeId" v-model="temp.employeeId" @keyup.enter.native="deptenter" />
        </el-form-item>

        <el-form-item label="购置日期" prop="purchaseDate">
          <el-date-picker v-model="temp.purchaseDate" type="date" placeholder="选择日期" />
          <!-- <el-input ref="deptname" v-model="temp.purchaseDate" @keyup.enter.native="deptenter" /> -->
        </el-form-item>
        <el-form-item label="入场日期" prop="entranceDate">
          <el-date-picker v-model="temp.entranceDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="牧场设备编号" prop="equipmentNumber">
          <el-input ref="equipmentNumber" v-model="temp.equipmentNumber" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="年保养费用" prop="yearUpkeepCost">
          <el-input ref="yearUpkeepCost" v-model="temp.yearUpkeepCost" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="年维修费用" prop="yearMaintainDost">
          <el-input ref="yearMaintainDost" v-model="temp.yearMaintainDost" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="原值" prop="yuanZhi">
          <el-input ref="yuanZhi" v-model="temp.yuanZhi" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="财务编号" prop="financeNumber">
          <el-input ref="financeNumber" v-model="temp.financeNumber" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="设备类别" prop="typeName">
          <el-input ref="typeName" v-model="temp.typeName" @keyup.enter.native="deptenter" />
        </el-form-item>
        <el-form-item label="录入时间" prop="inputDatetime">
          <el-input ref="inputDatetime" v-model="temp.inputDatetime" @keyup.enter.native="deptenter" />
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
</template>

<script>
import { GetDataByName } from '@/api/common'
import waves from '@/directive/waves' // waves directive
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
        name: 'getAssetList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          assetNumber: '',
          assetName: '',
          pastureName: '',
          status: '正常'
        }
      },
      filterstatusoptions: [
        {
          value: '正常1',
          label: '正常'
        },
        {
          value: '闲置1',
          label: '闲置'
        }
      ],

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
        timestamp: [
          {
            type: 'date',
            required: true,
            message: '必填时间',
            trigger: 'change'
          }
        ],
        title: [{ required: true, message: '必填标题', trigger: 'blur' }]
      },
      rowStyle: { maxHeight: 10 + 'px', height: 10 + 'px' },
      cellStyle: { padding: 0 + 'px' },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
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
    }
  }
}
</script>
