<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索条件 -->
      <el-input
        v-model="getdataListParm.parammaps.rufuseNumber"
        placeholder="旧品编号"
        style="width: 140px;"
        class="filter-item"
      />
      <el-input
        v-model="getdataListParm.parammaps.refuseName"
        placeholder="旧品名称"
        style="width: 140px;"
        class="filter-item"
      />

      <el-select
        v-model="getdataListParm.parammaps.statue"
        clearable
        placeholder="状态"
        class="filter-item"
      >
        <el-option
          v-for="item in getDictByName"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="getdataListParm.parammaps.ename"
        clearable
        placeholder="处理人"
        class="filter-item"
      >
        <el-option
          v-for="item in findAllEmploye"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>-->
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
      <!-- table表格 -->
      <el-table-column label="清单" min-width="220px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">清单编号：</span> {{ scope.row.listNumber }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">清单类型：</span> {{ scope.row.listType }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="牧场/部门" min-width="130px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">牧场：</span> {{ scope.row.pastureName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">部门：</span> {{ scope.row.departName }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="备件信息" min-width="265px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">备件编号：</span>{{ scope.row.stockNumber }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">备件名称：</span>{{ scope.row.stockName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">规格型号：</span>{{ scope.row.specification }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">供应商：</span>{{ scope.row.provider }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="单价/数量" min-width="150px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">单价：</span>{{ scope.row.price }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">数量({{ scope.row.unit }})：</span>{{ scope.row.amount }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="处理信息" min-width="235px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">处理日期：</span>{{ scope.row.handleDate }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">处理人：</span>{{ scope.row.employeName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">状态：</span>{{ scope.row.statue }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleDestruction(row)">销毁/卖掉</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="getdataListParm.offset"
      :limit.sync="getdataListParm.pagecount"
      @pagination="getList"
    />
    <!-- 弹出层销毁/卖掉 -->
    <el-dialog
      :title="textMap[dialogStatusDestruction]"
      :visible.sync="dialogFormVisibleDestruction"
      :close-on-click-modal="false"
    >
      <el-form
        ref="temp"
        :model="temp"
        label-position="right"
        label-width="100px"
        style="width: 800px; margin-left:50px;"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="牧场" prop="pastureName">
              <el-input ref="pastureName" v-model="temp.pastureName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门" prop="departName">
              <el-input ref="departName" v-model="temp.departName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单号" prop="listNumber">
              <el-input ref="listNumber" v-model="temp.listNumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="类型" prop="listType">
              <el-input ref="listType" v-model="temp.listType" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格" prop="specification">
              <el-input ref="specification" v-model="temp.specification" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量" prop="rufuseNumber">
              <el-input ref="rufuseNumber" v-model="temp.rufuseNumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单位" prop="unit">
              <el-input ref="unit" v-model="temp.unit" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="处理结果" prop="isOrNo">
              <el-radio v-model="isOrNo" label="0">销毁</el-radio>
              <el-radio v-model="isOrNo" label="1">卖掉</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="dialogStatusDestruction==='create'"
          ref="createb"
          type="success"
          @click="createData_again()"
        >确认新增</el-button>
        <el-button
          type="primary"
          @click="dialogStatusDestruction==='create'?createData():updateDataDestruction()"
        >确认</el-button>
        <el-button @click="dialogFormVisibleDestruction = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 引入
import { GetDataByName, GetDataByNames, PostDataByName } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
// eslint-disable-next-line no-unused-vars
import { validateEMail } from '@/utils/validate.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import { MessageBox } from 'element-ui'
export default {
  name: 'Refuse',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      isOrNo: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      state1: '',
      radio: '',
      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getRefuseList',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          assetNumber: '',
          assetName: '',
          pastureName: '',
          status: ''
        }
      },
      // 2-3：下拉框请求后数据加入[]
      findAllProvider: [],
      findAllAssetType: [],
      findAllPasture: [],
      findAllDepart: [],
      findAllEmploye: [],
      getDictByName: [],
      // 2-1.请求下拉框接口
      requestParams: [
        { name: 'findAllProvider', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllAssetType', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllPasture', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllDepart', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllEmploye', offset: 0, pagecount: 0, params: [] },
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['旧品状态'] }
      ],

      temp: {},
      dialogFormVisibleDestruction: false,
      dialogStatusDestruction: '',
      textMap: {
        destruction: '销毁/卖掉'
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
      })
    },
    handleFilter() {
      this.listLoading = true
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
        // 格式化日期
        inputDatetime: parseTime(new Date(), '{y}-{m}-{d}')
      }
    },
    // 销毁/卖掉
    handleDestruction(row) {
      if (row.statue === '未处理') {
        console.log(row)
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatusDestruction = 'destruction'
        this.dialogFormVisibleDestruction = true
      } else {
        this.$notify({
          title: '',
          message: '旧品已处理...',
          type: 'warning',
          duration: 2000
        })
      }
    },
    updateDataDestruction() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'okRefuseDispose'
          this.requestParam.parammaps = this.temp
          this.requestParam.parammaps['isOrNo'] = this.isOrNo
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
              this.dialogFormVisibleDestruction = false
              this.$notify({
                title: '成功',
                message: '成功',
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
.fixed-width .el-button--mini {
  width: 70px;
}
</style>
