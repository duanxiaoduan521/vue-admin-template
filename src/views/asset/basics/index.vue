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
      <el-select v-model="getdataListParm.parammaps.value" placeholder="状态" class="filter-item">
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
        label-position="right"
        label-width="100px"
        style="width: 800px; margin-left:50px;"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="资产编号" prop="assetNumber">
              <el-input
                ref="assetNumber"
                v-model="temp.assetNumber"
                @keyup.enter.native="deptenter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input
                ref="equipmentName"
                v-model="temp.equipmentName"
                @keyup.enter.native="deptenter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="规格" prop="specification">
              <el-input
                ref="specification"
                v-model="temp.specification"
                @keyup.enter.native="deptenter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌" prop="proId">
              <el-select v-model="temp.proId" placeholder="品牌" class="filter-item">
                <el-option
                  v-for="item in findAllProvider"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用途" prop="deptname">
              <el-input ref="deptname" v-model="temp.purpose" @keyup.enter.native="deptenter" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="牧场" prop="pastureId">
              <el-select v-model="temp.pastureId" placeholder="牧场" class="filter-item">
                <el-option
                  v-for="item in findAllPasture"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门" prop="departmentId">
              <el-select v-model="temp.departmentId" placeholder="部门" class="filter-item">
                <el-option
                  v-for="item in findAllDepart"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人" prop="employeeId">
              <el-select v-model="temp.employeeId" placeholder="负责人" class="filter-item">
                <el-option
                  v-for="item in findAllEmploye"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="购置日期" prop="purchaseDate">
              <el-date-picker v-model="temp.purchaseDate" type="date" placeholder="选择日期" style="width:170px;" />
              <!-- <el-input ref="deptname" v-model="temp.purchaseDate" @keyup.enter.native="deptenter" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入场日期" prop="entranceDate">
              <el-date-picker v-model="temp.entranceDate" type="date" placeholder="选择日期" style="width:170px;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="牧场编号" prop="equipmentNumber">
              <el-input
                ref="equipmentNumber"
                v-model="temp.equipmentNumber"
                @keyup.enter.native="deptenter"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="年保养费用" prop="yearUpkeepCost">
              <el-input
                ref="yearUpkeepCost"
                v-model="temp.yearUpkeepCost"
                @keyup.enter.native="deptenter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年维修费用" prop="yearMaintainDost">
              <el-input
                ref="yearMaintainDost"
                v-model="temp.yearMaintainDost"
                @keyup.enter.native="deptenter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原值" prop="yuanZhi">
              <el-input ref="yuanZhi" v-model="temp.yuanZhi" @keyup.enter.native="deptenter" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备类别" prop="typeName">
              <el-input ref="typeName" v-model="temp.typeName" @keyup.enter.native="deptenter" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="财务编号" prop="financeNumber">
              <el-input
                ref="financeNumber"
                v-model="temp.financeNumber"
                @keyup.enter.native="deptenter"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="录入时间" prop="inputDatetime">
              <el-date-picker
                v-model="temp.inputDatetime"
                type="date"
                placeholder="录入时间"
                disabled
              />

            </el-form-item>
          </el-col>
        </el-row>
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
import { GetDataByName, GetDataByNames, PostDataByName } from '@/api/common'
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

      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {
        }
      },
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
      findAllProvider: [],
      findAllAssetType: [],
      findAllPasture: [],
      findAllDepart: [],
      findAllEmploye: [],
      requestParams: [
        { name: 'findAllProvider', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllAssetType', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllPasture', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllDepart', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllEmploye', offset: 0, pagecount: 0, params: [] }
      ],

      filterstatusoptions: [
        {
          value: '正常',
          label: '正常'
        },
        {
          value: '闲置',
          label: '闲置'
        },
        {
          value: '封存',
          label: '封存'
        },
        {
          value: '改造',
          label: '改造'
        },
        {
          value: '报废',
          label: '报废'
        },
        {
          value: '租赁',
          label: '租赁'
        }
      ],

      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: '正常'
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
      GetDataByNames(this.requestParams).then(response => {
        this.findAllProvider = response.data.findAllProvider.list
        this.findAllAssetType = response.data.findAllAssetType.list
        this.findAllPasture = response.data.findAllPasture.list
        this.findAllDepart = response.data.findAllDepart.list
        this.findAllEmploye = response.data.findAllEmploye.list
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
        inputDatetime: new Date(),
        title: '',
        status: '正常',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      })
    },
    createData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'insertAsset'
          this.requestParam.parammaps = this.temp
          PostDataByName(this.requestParam).then(response => {
            console.log(response)
            if (response.msg === 'fail') {
              this.$notify({
                title: '失败',
                message: '保存失败-' + response.data,
                type: 'danger',
                duration: 2000
              })
            } else {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
            }
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
