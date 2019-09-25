<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索条件 -->
      <el-input
        v-model="getdataListParm.parammaps.useForm"
        placeholder="领用单单号"
        style="width: 140px;"
        class="filter-item"
      />
      <el-select
        v-model="getdataListParm.parammaps.listType"
        clearable
        placeholder="类型"
        class="filter-item"
      >
        <el-option
          v-for="item in findAllPasture"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-date-picker
        v-model="getdataListParm.parammaps.createTime"
        type="date"
        placeholder="领用时间"
        style="width:170px;top:-3px;"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      />
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
      <!-- table表格 -->
      <el-table-column label="领用单号" min-width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.useForm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.listType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="牧场部门" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}{{ scope.row.departmentName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="单号" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oddNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单生成时间" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" min-width="130px" align="center">
        <template slot-scope="scope">
          <span>
            审核状态：{{ scope.row.checkStatue }}
            <br>
          </span>
          <span>
            申请人:{{ scope.row.applicatName }}
            <br>
          </span>
          <span>
            审核人:{{ scope.row.employeName }}
            <br>
          </span>
          <span>
            审核时间:{{ scope.row.auditTime }}
            <br>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleExamine(row)">详细审核</el-button>
          <el-button type="success" size="mini" @click="handleUse(row)">确认领用</el-button>
          <el-button type="success" size="mini" @click="handleOld(row)">旧品录入</el-button>
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
    <!-- 新增 -->
    <!-- <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <div class="app-container">
        <ReceiveAdd
          ref="ReceiveAdd"
          :type-temp="temp"
        />
      </div>
    </el-dialog> -->
    <!-- 修改 -->
    <!-- <el-dialog
      :title="textMap[dialogStatusUpdate]"
      :visible.sync="dialogFormVisibleUpdate"
      :close-on-click-modal="false"
    >
      <div class="app-container">
        <ReceiveModify />
      </div>
    </el-dialog> -->
    <!-- 详细审核 -->
    <!-- <el-dialog
      :title="textMap[dialogStatusExamine]"
      :visible.sync="dialogFormVisibleExamine"
      :close-on-click-modal="false"
    >
      <div class="app-container">
        <ReceiveExamine />
      </div>
    </el-dialog> -->
    <!-- 确认领用 -->
    <!-- <el-dialog
      :title="textMap[dialogStatusUse]"
      :visible.sync="dialogFormVisibleUse"
      :close-on-click-modal="false"
    >
      <div class="app-container">
        <ReceiveUse />
      </div>
    </el-dialog> -->
    <!-- 旧品录入 -->
    <!-- <el-dialog
      :title="textMap[dialogStatusOld]"
      :visible.sync="dialogFormVisibleOld"
      :close-on-click-modal="false"
    >
      <div class="app-container">
        <ReceiveOld />
      </div>
    </el-dialog> -->

    <!-- 新增 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <div class="app-container">
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
              <el-form-item label="申购单编号" prop="assetNumber">
                <el-input ref="assetNumber" v-model="temp.assetNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="是否加急" prop="assetNumber">
                <el-switch v-model="value" active-color="#13ce66" inactive-color="#eee" />
              </el-form-item>
            </el-col>
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
        </el-form>
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

          <el-table-column label="类型" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="id" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.assetNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="id" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.assetNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="id" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.assetNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row}">
              <el-button type="success" size="mini" @click="handleUpdate(row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
              <el-form-item label="录入时间" prop="inputDatetime">
                <el-date-picker
                  v-model="temp.inputDatetime"
                  type="date"
                  placeholder="录入时间"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width:170px;"
                />
              </el-form-item>
            </el-col>
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
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog
      :title="textMap[dialogStatusUpdate]"
      :visible.sync="dialogFormVisibleUpdate"
      :close-on-click-modal="false"
    >
      <div class="app-containtermodify">
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
          <el-table-column label="备件编码" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useForm }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备件名称" prop="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.listType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}{{ scope.row.departmentName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领用数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button
            v-if="dialogStatusUpdate==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >确认新增</el-button>
          <el-button type="primary" @click="dialogStatusUpdate==='create'?createData():updateData()">确认</el-button>
          <el-button @click="dialogFormVisibleUpdate = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 详细审核 -->
    <el-dialog
      :title="textMap[dialogStatusExamine]"
      :visible.sync="dialogFormVisibleExamine"
      :close-on-click-modal="false"
    >
      <div class="app-containerExamine">
        <el-table
          :key="tableKey"
          element-loading-text="给我一点时间"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :row-style="rowStyle"
          :cell-style="cellStyle"
          class="elTable"
        >
          <!-- table表格 -->
          <el-table-column label="备件编码" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useForm }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备件名称" prop="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.listType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}{{ scope.row.departmentName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领用数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总价" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审批数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="驳回原因" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否驳回" min-width="110px" align="center">
            <template slot-scope="scope">
              <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" />
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button
            v-if="dialogStatus==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >确认新增</el-button>
          <el-button type="primary" @click="dialogStatusExamine==='create'?createData():updateData()">确认</el-button>
          <el-button @click="dialogFormVisibleExamine = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 确认领用 -->
    <el-dialog
      :title="textMap[dialogStatusUse]"
      :visible.sync="dialogFormVisibleUse"
      :close-on-click-modal="false"
    >
      <div class="app-containerUse">
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
          <el-table-column label="备件编码" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useForm }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备件名称" prop="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.listType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}{{ scope.row.departmentName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领用数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否有旧品" min-width="110px" align="center">
            <template slot-scope="scope">
              <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" />
            </template>
          </el-table-column>
          <el-table-column label="旧品数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button
            v-if="dialogStatus==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >确认新增</el-button>
          <el-button type="primary" @click="dialogStatusUse==='create'?createData():updateData()">确认</el-button>
          <el-button @click="dialogFormVisibleUse = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 旧品录入 -->
    <el-dialog
      :title="textMap[dialogStatusOld]"
      :visible.sync="dialogFormVisibleOld"
      :close-on-click-modal="false"
    >
      <div class="app-containerOld">
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
          <el-table-column label="备件编码" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useForm }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备件名称" prop="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.listType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}{{ scope.row.departmentName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="牧场" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领单编号" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="应入数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实入数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.oddNumber }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button
            v-if="dialogStatusOld==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >确认新增</el-button>
          <el-button type="primary" @click="dialogStatusOld==='create'?createData():updateData()">确认</el-button>
          <el-button @click="dialogFormVisibleOld = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// / 引入
import { GetDataByName, GetDataByNames, PostDataByName } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
// eslint-disable-next-line no-unused-vars
import { validateEMail } from '@/utils/validate.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
// import ReceiveAdd from './components/receiveAdd'
// import ReceiveModify from './components/receiveModify'
// import ReceiveExamine from './components/receiveExamine'
// import ReceiveUse from './components/receiveUse'
// import ReceiveOld from './components/receiveOld'
export default {
  name: 'Subscribe',
  // components: { Pagination, ReceiveAdd, ReceiveModify, ReceiveExamine, ReceiveUse, ReceiveOld },
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      rules: '',
      value: false,
      listLoading: true,
      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getBigStockUseList',
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
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['资产状态'] }
      ],

      temp: {},
      dialogFormVisible: false,
      dialogFormVisibleUpdate: false,
      dialogFormVisibleExamine: false,
      dialogFormVisibleUse: false,
      dialogFormVisibleOld: false,
      dialogStatus: '',
      dialogStatusUpdate: '',
      dialogStatusExamine: '',
      dialogStatusUse: '',
      dialogStatusOld: '',
      textMap: {
        update: '编辑',
        create: '新增',
        examine: '详细审核',
        use: '确认领用',
        old: '旧品录入'
      },
      dialogPvVisible: false,
      // 校验规则
      rules: {
        assetNumber: [
          { required: true, message: '必填', trigger: 'blur' },
          // 引入自定义校验并使用
          { validator: validateEMail, trigger: 'blur' }
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
      this.temp.providerId = item.id
      this.temp.providerName = item.name
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
      console.log('sdf')
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['temp'].clearValidate()
      // })
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
              this.dialogFormVisibleUpdate = false
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
    // 修改
    handleUpdate(row) {
      // this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusUpdate = 'update'
      this.dialogFormVisibleUpdate = true
      // this.$nextTick(() => {
      //   this.$refs['temp'].clearValidate()
      // })
    },
    // 详细审核
    handleExamine(row) {
      // this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusExamine = 'examine'
      this.dialogFormVisibleExamine = true
      // this.$nextTick(() => {
      //   this.$refs['temp'].clearValidate()
      // })
    },
    // 确认领用
    handleUse(row) {
      // this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusUse = 'use'
      this.dialogFormVisibleUse = true
      // this.$nextTick(() => {
      //   this.$refs['temp'].clearValidate()
      // })
    },
    // 旧品录入
    handleOld(row) {
      // this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusOld = 'old'
      this.dialogFormVisibleOld = true
      // this.$nextTick(() => {
      //   this.$refs['temp'].clearValidate()
      // })
    }
    // updateData() {
    //   this.$refs['temp'].validate(valid => {
    //     if (valid) {
    //       this.requestParam.name = 'updateAsset'
    //       this.requestParam.parammaps = this.temp
    //       PostDataByName(this.requestParam).then(response => {
    //         console.log(response)
    //         if (response.msg === 'fail') {
    //           this.$notify({
    //             title: '失败',
    //             message: '保存失败-' + response.data,
    //             type: 'warning',
    //             duration: 2000
    //           })
    //         } else {
    //           this.getList()
    //           this.dialogFormVisible = false
    //           this.$notify({
    //             title: '成功',
    //             message: '修改成功',
    //             type: 'success',
    //             duration: 2000
    //           })
    //         }
    //       })
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.fixed-width .el-button--mini {
  width: 70px;
  margin-top: 10px;
  margin-left: 0;
}
.el-table .cell {
  text-align: left !important;
}
</style>
