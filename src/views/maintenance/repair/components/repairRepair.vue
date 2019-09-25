<template>
  <div class="receive-content">
    <el-form
      ref="repairTemp"
      :model="repairTemp"
      label-position="right"
      label-width="100px"
      style="width: 800px; margin-left:50px;"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="牧场" prop="pastureId">
            <el-select v-model="repairTemp.pastureId" placeholder="牧场" class="filter-item">
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
            <el-select v-model="repairTemp.departmentId" placeholder="部门" class="filter-item">
              <el-option
                v-for="item in findAllDepart"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="providerId">
            <el-autocomplete
              v-model="temp.providerName"
              value-key="name"
              class="inline-input"
              :fetch-suggestions="providerSearch"
              placeholder="请输入名称或编号新增备件"
              style="width:200px"
              @select="handleSelect"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="牧场设备编号" prop="stockNumber">
            <el-input ref="stockNumber" v-model="temp.stockNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备名称" prop="stockName">
            <el-input ref="stockName" v-model="temp.stockName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="故障部位" prop="pastureId">
            <el-select v-model="repairTemp.pastureId" placeholder="故障部位" class="filter-item">
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
          <el-form-item label="故障现象" prop="departmentId">
            <el-select v-model="repairTemp.departmentId" placeholder="故障现象" class="filter-item">
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
          <el-form-item label="故障详情" prop="stockNumber">
            <el-input ref="stockNumber" v-model="temp.stockNumber" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="责任人" prop="employeId">
            <el-select v-model="temp.employeId" placeholder="责任人" class="filter-item">
              <el-option
                v-for="item in findAllEmploye"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="日期" prop="inputDatetime">
            <el-date-picker
              v-model="temp.inputDatetime"
              type="date"
              placeholder="日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width:170px;"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        v-if="dialogStatusRepair==='create'"
        ref="createb"
        type="success"
        @click="createData_again()"
      >确认新增</el-button>
      <el-button type="primary" @click="dialogStatusUpdate==='create'?createData():updateData()">确认</el-button>
      <el-button @click="dialogFormVisibleRepair = false">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { GetDataByName, GetDataByNames, PostDataByName } from '@/api/common'
import { parseTime } from '@/utils/index.js'
// eslint-disable-next-line no-unused-vars
import { validateEMail } from '@/utils/validate.js'
export default {
  name: 'RepairRepair',
  // props: ['repairTemp'],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    repairTemp: {
      type: Object
    },
    dialogFormVisibleRepair: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      state1: '',
      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getRepairsList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          assetNumber: '',
          assetName: '',
          pastureName: '',
          applyTime: ''
        }
      },
      // 2-3：下拉框请求后数据加入[]
      findAllProvider: [],
      findAllAssetType: [],
      findAllPasture: [],
      findAllDepart: [],
      findAllEmploye: [],
      getDictByName: [],
      getDictByNameA: [],
      // 2-1.请求下拉框接口
      requestParams: [
        { name: 'findAllProvider', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllAssetType', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllPasture', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllDepart', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllEmploye', offset: 0, pagecount: 0, params: [] },
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['处理状态'] }
      ],

      requestParamAs: [
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['审核状态'] }
      ],
      temp: {},
      // dialogFormVisibleRepair: false,
      dialogStatusRepair: '',
      textMap: {
        repair: '报修',
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      // 校验规则
      rules: {
        assetNumber: [
          { required: true, message: '必填', trigger: 'blur' }
          // 引入自定义校验并使用
          // { validator: validateEMail, trigger: 'blur' }
        ],
        equipmentName: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      rowStyle: { maxHeight: 50 + 'px', height: 45 + 'px' },
      cellStyle: { padding: 0 + 'px' }
    }
  },
  watch: {
    dialogFormVisibleRepair(val) {
      console.log(val)
      this.getdataListParm.params = [this.assetTypeid]
      this.getList()
    }
  },
  created() {
    this.getDownList()
    this.getList()
  },

  methods: {
    // 供应商模糊查询
    providerSearch(queryString, cb) {
      var returnList = this.findAllProvider
      var results = queryString
        ? returnList.filter(this.createFilter(queryString))
        : returnList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return returnValue => {
        return (
          returnValue.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0
        )
      }
    },
    handleSelect(item) {
      console.log(item)
    },
    // 1-1: table&搜索
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
    // 2-2：下拉框
    getDownList() {
      GetDataByNames(this.requestParams).then(response => {
        this.findAllProvider = response.data.findAllProvider.list
        this.findAllAssetType = response.data.findAllAssetType.list
        this.findAllPasture = response.data.findAllPasture.list
        this.findAllDepart = response.data.findAllDepart.list
        this.findAllEmploye = response.data.findAllEmploye.list
        this.getDictByName = response.data.getDictByName.list
        this.$nextTick(() => {
          GetDataByNames(this.requestParamAs).then(response => {
            this.getDictByNameA = response.data.getDictByName.list
          })
        })
      })
    },
    handleFilter() {
      this.listLoading = true
      this.getList()
    },
    resetTemp() {
      this.temp = {
        // 格式化日期
        inputDatetime: parseTime(new Date(), '{y}-{m}-{d}')
      }
    },
    // 报修
    handleCreateRepair(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusRepair = 'repair'
      this.dialogFormVisibleRepair = true
    },
    updateData() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'updateAsset'
          this.requestParam.parammaps = this.temp
          PostDataByName(this.requestParam).then(response => {
            console.log(response)
            if (response.msg === 'fail') {
              this.$notify({
                title: '失败',
                message: '保存失败-' + response.data,
                type: 'warning',
                duration: 2000
              })
            } else {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
</style>
