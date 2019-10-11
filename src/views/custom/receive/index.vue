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
      <el-table-column label="领用单号" min-width="35px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.useForm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="牧场/部门" width="170px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">牧场：</span>{{ scope.row.pastureName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">部门：</span>{{ scope.row.departmentName }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="申请信息" min-width="50px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">单号：</span>{{ scope.row.oddNumber }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">类型：</span>{{ scope.row.listType }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">申请人：</span>{{ scope.row.applicatName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">申请时间：</span>{{ scope.row.createTime }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" min-width="50px" align="center">
        <template slot-scope="scope">
          <!-- <span style="float:left;"><span style="font-weight:bold;">审核状态：</span>{{ scope.row.checkStatue }}</span><br> -->
          <span style="float:left;"><span style="font-weight:bold;">主管审核：</span>{{ scope.row.auditorName }}</span>
          <span style="float:right;"><span style="font-weight:bold;">主管审核状态：</span>{{ scope.row.receiveStatue }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">主管审核时间：</span>{{ scope.row.auditTime }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">审核：</span>{{ scope.row.employeeName }}</span>
          <span style="float:right;"><span style="font-weight:bold;">审核状态：</span>{{ scope.row.employeeStatus }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">审核时间：</span>{{ scope.row.employeeTime }}</span><br>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleZGExamine(row)">主管审核</el-button>
          <el-button type="success" size="mini" @click="handleExamine(row)">审核</el-button>
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <div class="app-container">
        <el-form
          ref="temp"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 800px; margin-left:50px;"
        >
          <el-row>
            <el-col :span="10">
              <el-form-item label="申领单编号" prop="repairNumber">
                <el-input ref="repairNumber" v-model="temp.repairNumber" />
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
            <!--             <el-col :span="8">
              <el-button style="margin-left:30px;" @click="handleshengcheng">生成领用单</el-button>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col v-if="display" :span="8">
              <el-form-item label="编号/名称：" prop="stockA">
                <el-autocomplete
                  v-model="stockAAA.stockA"
                  style="width:430px;"
                  class="inline-input mediaInput"
                  :fetch-suggestions="stockSearch"
                  placeholder="请输入备件编号或者备件名称"
                  :disabled="dialogStatus==='update'"
                  :trigger-on-focus="false"
                  @select="handleStockSelect"
                >
                  <template slot-scope="{ item }">
                    <div class="name" style="display: inline;">{{ item.stockNumber }}</div>
                    <span class="addr">{{ item.stockName }}</span>&nbsp; &nbsp; 库存数量：<span class="addr">{{ item.repertory }}</span>
                  </template>
                </el-autocomplete>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">关闭</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          v-if="display"
          :key="tableKey"
          v-loading="listLoading"
          element-loading-text="给我一点时间"
          :data="list2"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :row-style="rowStyle"
          :cell-style="cellStyle"
          class="elTable"
        >
          <el-table-column label="名称" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.stockName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编码" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.stockNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <el-form :model="scope.row" :rules="rules">
                <el-form-item prop="amount">
                  <el-input v-show="true" v-model="scope.row.amount" style="width:80px;border:none;margin-top:25px;height:30px" />
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200px"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row}">
              <el-button type="danger" size="mini" @click="stockDel(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogStatus==='create'?createDataReCeiveW():createDataReCeiveW()">确认</el-button>
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
          :data="listUpdate"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :row-style="rowStyle"
          :cell-style="cellStyle"
          class="elTable"
        >
          <!-- table表格 -->
          <el-table-column label="备件编号" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.stockNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备件名称" prop="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.stockName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.providerName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领用数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <input v-model="scope.row.useNumber" type="text" value="scope.row.useNumber" style="width:30px">
            </template>
          </el-table-column>
          <el-table-column label="单价" min-width="70px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="70px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="110px" align="center">
            <template slot-scope="scope">
              <input v-model="scope.row.note" type="text" value="scope.row.note" style="width:80px">
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="success" size="mini" @click="handleUpdateSave(row)">保存</el-button>
              <el-button type="success" size="mini" @click="handleUpdateDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleUpdate = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 审核 -->
    <el-dialog
      :title="textMap[dialogStatusExamine]"
      :visible.sync="dialogFormVisibleExamine"
      :close-on-click-modal="false"
    >
      <div class="app-containerExamine">
        <el-table
          :key="tableKey"
          :data="listExamine"
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
          <el-table-column label="备件编号" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.stockNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备件名称" prop="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.stockName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.providerName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领用数量" min-width="80px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="70px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" min-width="70px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="审批数量" min-width="80px" align="center">
            <template slot-scope="scope">
              <input v-model="scope.row.approvalAmount" type="text" value="scope.row.approvalAmount" style="width:30px;">
            </template>
          </el-table-column> -->
          <el-table-column label="总价" min-width="70px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sumPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="驳回原因" min-width="110px" align="center">
            <template slot-scope="scope">
              <input v-model="scope.row.auditorNote" type="text" value="scope.row.auditorNote" style="width:50px;">
            </template>
          </el-table-column>
          <el-table-column label="是否驳回" property="isReject" min-width="110px" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isReject" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" />
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogStatusExamine==='create'?createData():updateDataExamine()">确认</el-button>
          <el-button @click="dialogFormVisibleExamine = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 主管审核 -->
    <el-dialog
      :title="textMap[dialogStatusZGExamine]"
      :visible.sync="dialogFormVisibleZGExamine"
      :close-on-click-modal="false"
    >
      <div class="app-containerExamine">
        <el-table
          :key="tableKey"
          :data="listExamine"
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
          <el-table-column label="备件编号" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.stockNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备件名称" prop="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.stockName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.providerName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领用数量" min-width="80px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="70px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" min-width="70px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="审批数量" min-width="80px" align="center">
            <template slot-scope="scope">
              <input v-model="scope.row.approvalAmount" type="text" value="scope.row.approvalAmount" style="width:30px;">
            </template>
          </el-table-column> -->
          <el-table-column label="总价" min-width="70px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sumPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="驳回原因" min-width="110px" align="center">
            <template slot-scope="scope">
              <input v-model="scope.row.auditNote" type="text" value="scope.row.auditNote" style="width:50px;">
            </template>
          </el-table-column>
          <el-table-column label="是否驳回" property="isOver" min-width="110px" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isOver" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" />
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogStatusExamine==='create'?createData():updateDataZGExamine()">确认</el-button>
          <el-button @click="dialogFormVisibleZGExamine = false">关闭</el-button>
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
          :data="listUse"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :row-style="rowStyle"
          :cell-style="cellStyle"
          class="elTable"
        >
          <!-- table表格 -->
          <el-table-column label="备件编号" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.stockNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备件名称" prop="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.stockName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.providerName }}{{ scope.row.departmentName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领用数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价(元)" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总价(元)" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sumPrice }}</span>
            </template>
          </el-table-column>

          <el-table-column label="是否有旧品" min-width="110px" header-align="center" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isRefuse"
                :active-value="1"
                :inactive-value="0"
                @change="handleEnableChange(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
          <!--           <el-table-column label="是否有旧品" property="isRefuse" min-width="110px" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isRefuse" active-color="#13ce66" inactive-color="#ff4949" active-value="0" inactive-value="1" disabled />
            </template>
          </el-table-column> -->
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogStatusUse==='create'?updateDataUse():updateDataUse()">确认</el-button>
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
          :data="listOld"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          :row-style="rowStyle"
          :cell-style="cellStyle"
          class="elTable"
        >
          <!-- table表格 -->
          <el-table-column label="牧场名称" min-width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门名称" prop="id" align="center" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.departmentName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单号" width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useForm }}</span>
            </template>
          </el-table-column>

          <el-table-column label="备件编号" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.stockNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备件名称" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.stockName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="供应商" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.providerName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.specification }}</span>
            </template>
          </el-table-column>
          <el-table-column label="应入数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实入数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <input v-model="scope.row.refuseNumber" type="text" value="scope.row.refuseNumber" style="width:30px;">
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="110px" align="center">
            <template slot-scope="scope">
              <input v-model="scope.row.note" type="text" value="scope.row.note" style="width:50px;">
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogStatusOld==='create'?createData():updateDataOld()">确认</el-button>
          <el-button @click="dialogFormVisibleOld = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// / 引入
import { GetDataByName, GetDataByNames, PostDataByName, ExecDataByConfig } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
// eslint-disable-next-line no-unused-vars
import { validateEMail } from '@/utils/validate.js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'Subscribe',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      display: true,
      tableKey: 0,
      list: [],
      list2: [],
      // disabled
      listUpdate: [],
      listExamine: [],
      listZGExamine: [],
      listshengcheng: [],
      listCreate: [],
      listUse: [],
      listOld: [],
      total: 0,
      value: false,
      listLoading: true,
      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      requestFilterParams: {
        returntype: 'Map',
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
      getdataListParmCreate: {
        name: 'createOddNumber',
        page: 0,
        offset: 0,
        pagecount: 0,
        returntype: 'Map',
        parammaps: {}
      },
      // 修改
      getdataListParmUpdate: {
        name: 'findByIdStockUses',
        page: 0,
        offset: 0,
        pagecount: 0,
        returntype: 'Map',
        parammaps: {}
      },
      // 主管审核
      getdataListParmZGExamine: {
        name: 'findByIdStockUses',
        page: 0,
        offset: 0,
        pagecount: 0,
        returntype: 'Map',
        parammaps: {}
      },
      // 审核
      getdataListParmExamine: {
        name: 'findByIdStockUses_Auditor',
        page: 0,
        offset: 0,
        pagecount: 0,
        returntype: 'Map',
        parammaps: {}
      },
      // 确认领用
      getdataListParmUse: {
        name: 'findByIdStockUses_OK',
        page: 0,
        offset: 0,
        pagecount: 0,
        returntype: 'Map',
        parammaps: {}
      },
      // 旧品录入
      getdataListParmOld: {
        name: 'findByIdStockUses_OK',
        page: 0,
        offset: 0,
        pagecount: 0,
        returntype: 'Map',
        parammaps: {}
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
      stockAAA: {
        stockA: '',
        stockNumber: '',
        stockName: '',
        specification: '',
        amount: '',
        note: ''
      },
      postDataPramas: {

      },
      temp: {},
      tempExamine: {},
      dialogFormVisible_StockAdd: false,
      dialogFormVisible: false,
      dialogFormVisibleUpdate: false,
      dialogFormVisibleExamine: false,
      dialogFormVisibleZGExamine: false,
      dialogFormVisibleUse: false,
      dialogFormVisibleOld: false,
      dialogStatus: '',
      dialogStatusUpdate: '',
      dialogStatusExamine: '',
      dialogStatusZGExamine: '',
      dialogStatusUse: '',
      dialogStatusOld: '',
      textMap: {
        update: '编辑',
        create: '新增',
        examine: '审核',
        zgexamine: '主管审核',
        use: '确认领用',
        old: '旧品录入'
      },
      dialogPvVisible: false,
      // 校验规则
      rules: {
        amount: [{ type: 'number', required: true, validator: (rule, value, callback) => {
          console.log(this.list2)
          console.log(this.list2[this.list2.length - 1].repertory)
          if (!value) {
            callback(new Error('不能为空'))
          }
          if (value < 0) {
            callback(new Error('必须大于0'))
          } else if (value > this.list2[this.list2.length - 1].repertory) {
            this.$message({
              type: 'warning',
              message: '输入的值不能大于当前库存'
            })
          }
          setTimeout(() => {
            const re = /^\d+$/ // /^[0-9]*[1-9][0-9]*$/
            const rsCheck = re.test(value)
            if (!rsCheck) {
              this.$message({
                type: 'warning',
                message: '请输入正整数'
              })
            } else {
              callback()
            }
          }, 0)
        }, trigger: 'blur' }]
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

    // 备件模糊搜索
    stockSearch(queryString, cb) {
      this.requestFilterParams.parammaps = {}
      this.requestFilterParams.name = 'findByDimStock'
      this.requestFilterParams.parammaps['stockA'] = queryString

      GetDataByName(this.requestFilterParams).then(response => {
        // console.log(response.data.list)
        cb(response.data.list)
      })
    },

    handleStockSelect(item) {
      var ss = 0
      GetDataByName(this.requestFilterParams).then(response => {
        this.$nextTick(() => {
          if (response.data.list.length > 0) {
            this.stockAAA = {}
            if (item.repertory <= 0) {
              this.$notify({
                title: '添加失败',
                message: '此备件无库存了，请联系库管尽快补货哦...',
                type: 'warning',
                duration: 2000
              })
            } else {
              if (this.list2 === null) {
                this.list2 = []
              }
              this.list2.some((item1, i) => {
                if (item1.stockNumber === item.stockNumber) {
                  ss = 1
                }
              })
              if (ss === 0) { this.list2.push(item) }
            }
          }
        })
      })
    },

    // 备件信息保存接口
    createDataReCeiveW() {
      this.postDataPramas.common = { 'returnmap': '0' }
      this.postDataPramas.data = []
      // this.postDataPramas.data[0] = { 'name': 'deleteStockUse1', 'type': 'e', 'parammaps': { 'bigId': this.temp.bigId }}
      // this.postDataPramas.data[1] = { 'name': 'deleteBigStockUse1', 'type': 'e', 'parammaps': { 'id': this.temp.bigId }}
      this.postDataPramas.data[0] = { 'name': 'insertBigStockUse_LY', 'type': 'e', 'parammaps': { }}
      this.postDataPramas.data[0].parammaps.useForm = this.$refs['temp'].$el[0].value
      this.postDataPramas.data[0].parammaps.pastureId = this.temp.pastureId
      this.postDataPramas.data[0].parammaps.departmentId = this.temp.departmentId
      this.postDataPramas.data[0].parammaps.employeId = this.temp.employeId
      this.postDataPramas.data[1] = { 'name': 'insertStockUse', 'resultmaps': { 'list': this.list2 }}
      this.postDataPramas.data[1].children = []
      this.postDataPramas.data[1].children[0] = { 'name': 'insertStockUse1', 'type': 'e', 'parammaps': { }}
      this.postDataPramas.data[1].children[0].parammaps.stockNumber = '@insertStockUse.stockNumber'
      this.postDataPramas.data[1].children[0].parammaps.stockName = '@insertStockUse.stockName'
      this.postDataPramas.data[1].children[0].parammaps.specification = '@insertStockUse.specification'
      this.postDataPramas.data[1].children[0].parammaps.useNumber = '@insertStockUse.amount'
      this.postDataPramas.data[1].children[0].parammaps.refuseNumber = '@insertStockUse.amount'
      this.postDataPramas.data[1].children[0].parammaps.bigId = '@insertBigStockUse_LY.LastInsertId'
      this.postDataPramas.data[1].children[0].parammaps.maintainId = '0'
      ExecDataByConfig(this.postDataPramas).then(response => {
        if (response.msg === 'fail') {
          this.$notify({
            title: '保存失败',
            message: response.data,
            type: 'warning',
            duration: 2000
          })
        } else {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },

    // 加载备件列表信息
    uplodeStockList() {
      if (this.list.length > 0) {
        this.requestFilterParams.parammaps = {}
        this.requestFilterParams.name = 'getOtherStockList'
        this.requestFilterParams.parammaps['bigId'] = this.bigsSolrId
        GetDataByName(this.requestFilterParams).then(response => {
          this.list2 = response.data.list
        })
      }
    },

    //  维修-备件信息删除保存（修改接口）
    stockAdd(row) {
      console.log(row)
      this.requestParam.parammaps = {}
      this.requestParam.name = 'updateStcokUseStock1'
      this.requestParam.parammaps['useNumber'] = row.amount
      this.requestParam.parammaps['id'] = row.stockUseId
      PostDataByName(this.requestParam).then(response => {
        if (response.msg === 'fail') {
          this.$notify({
            title: '失败',
            message: '保存失败-' + response.data,
            type: 'warning',
            duration: 2000
          })
          this.uplodeStockList()
        } else {
          this.getList()
          this.dialogFormVisible_StockAdd = false
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.uplodeStockList()
        }
      })
    },

    // 维修-备件信息删除
    stockDel(row) {
      MessageBox.confirm('确认删除此条信息？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.requestParam.name = 'deleteStcokUseStock1'
          this.requestParam.parammaps = {}
          this.requestParam.parammaps['id'] = row.stockUseId
          PostDataByName(this.requestParam).then(() => {
            this.getList()
            this.dialogFormVisible_StockAdd = false
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.uplodeStockList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 供应商模糊查询
    providerSearch(queryString, cb) {
      var returnList = this.findAllProvider
      var results = queryString ? returnList.filter(this.createFilter(queryString)) : returnList
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
      // console.log(item)
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
      GetDataByName(this.getdataListParmUpdate).then(response => {
        this.listUpdate = response.data.list
        // console.log(response.data.list)
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
      GetDataByName(this.getdataListParmCreate).then(response => {
        this.listCreate = response.data.list
        this.$nextTick(() => {
          this.$refs['temp'].$el[0].value = this.listCreate[0].repairNumber
          // console.log(this.$refs['temp'].$el[0])
        })
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
      console.log(row.receiveStatue)
      // eslint-disable-next-line eqeqeq
      if (row.receiveStatue == '未审核') {
        // this.temp = Object.assign({}, row) // copy obj
        this.dialogStatusUpdate = 'update'
        this.dialogFormVisibleUpdate = true
        this.getdataListParmUpdate.parammaps.id = row.id
        GetDataByName(this.getdataListParmUpdate).then(response => {
          this.listUpdate = response.data.list
          // console.log(response.data.list)
          if (response.data.total) {
            this.total = response.data.total
          }
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 100)
        })
      } else {
        this.$message({
          type: 'warning',
          message: '已经审核，不能再次编辑'
        })
      }
    },
    // 修改单条保存
    handleUpdateSave(row) {
      this.requestParam.name = 'updateStockUses'
      this.requestParam.parammaps = row
      PostDataByName(this.requestParam).then(response => {
        // console.log(response)
        if (response.msg === 'fail') {
          this.$notify({
            title: '失败',
            message: '保存失败-' + response.data,
            type: 'warning',
            duration: 2000
          })
        } else {
          this.getList()
          this.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 修改单条删除
    handleUpdateDelete(row) {
      MessageBox.confirm('设备名称：' + row.stockName, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.requestParam.name = 'deleteStockUses'
        this.requestParam.parammaps = row
        // this.requestParam.parammaps['id'] = row.id
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 主管审核
    handleZGExamine(row) {
      // console.log(row.receiveStatue)
      // eslint-disable-next-line eqeqeq
      if (row.receiveStatue == '未审核') {
        this.dialogStatusZGExamine = 'zgexamine'
        this.dialogFormVisibleZGExamine = true
        this.getdataListParmZGExamine.parammaps.id = row.id
        GetDataByName(this.getdataListParmZGExamine).then(response => {
          this.listExamine = response.data.list
          // console.log(response.data.list)
          if (response.data.total) {
            this.total = response.data.total
          }
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 100)
        })
      } else {
        this.$message({
          type: 'warning',
          message: '不能重复审核'
        })
      }
    },
    // 主管审核保存
    updateDataZGExamine() {
      this.postDataPramas.common = { 'returnmap': '0' }
      this.postDataPramas.data = []

      this.postDataPramas.data[0] = { 'name': 'insertSpotList', 'resultmaps': { 'list': [] }}
      this.postDataPramas.data[0].resultmaps.list = this.listExamine
      this.postDataPramas.data[0].children = []
      this.postDataPramas.data[0].children[0] = { 'name': 'verifyStockUse_Audit', 'type': 'e', 'parammaps': { }}
      this.postDataPramas.data[0].children[0].parammaps.isOver = '@insertSpotList.isOver'
      this.postDataPramas.data[0].children[0].parammaps.auditNote = '@insertSpotList.auditNote'
      this.postDataPramas.data[0].children[0].parammaps.id = '@insertSpotList.stockUseId'
      this.postDataPramas.data[0].children[1] = { 'name': 'updateBigStockUse_Audit', 'type': 'e', 'parammaps': { }}
      this.postDataPramas.data[0].children[1].parammaps.bigId = '@insertSpotList.bigId'
      this.postDataPramas.data[0].children[1].parammaps.jwt_username = '@common.jwt_username'

      ExecDataByConfig(this.postDataPramas).then(response => {
        if (response.msg === 'fail') {
          this.$notify({
            title: '保存失败',
            message: response.data,
            type: 'warning',
            duration: 2000
          })
        } else {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 审核
    handleExamine(row) {
      // console.log(row.employeeStatus)
      // eslint-disable-next-line no-empty
      if (row.employeeStatus === '未审核') {
        this.dialogStatusExamine = 'examine'
        this.dialogFormVisibleExamine = true
        this.getdataListParmExamine.parammaps.id = row.id
        GetDataByName(this.getdataListParmExamine).then(response => {
          this.listExamine = response.data.list
          // console.log(response.data.list)
          if (response.data.total) {
            this.total = response.data.total
          }
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 100)
        })
      } else {
        this.$message({
          type: 'warning',
          message: '不能重复审核'
        })
      }
    },
    // 审核保存
    updateDataExamine() {
      this.postDataPramas.common = { 'returnmap': '0' }
      this.postDataPramas.data = []

      this.postDataPramas.data[0] = { 'name': 'insertSpotList', 'resultmaps': { 'list': [] }}
      this.postDataPramas.data[0].resultmaps.list = this.listExamine
      this.postDataPramas.data[0].children = []
      this.postDataPramas.data[0].children[0] = { 'name': 'verifyStockUse_Auditor', 'type': 'e', 'parammaps': { }}
      this.postDataPramas.data[0].children[0].parammaps.isReject = '@insertSpotList.isReject'
      this.postDataPramas.data[0].children[0].parammaps.auditorNote = '@insertSpotList.auditorNote'
      this.postDataPramas.data[0].children[0].parammaps.id = '@insertSpotList.stockUseId'
      this.postDataPramas.data[0].children[1] = { 'name': 'updateBigStockUse_Auditor', 'type': 'e', 'parammaps': { }}
      this.postDataPramas.data[0].children[1].parammaps.bigId = '@insertSpotList.bigId'
      this.postDataPramas.data[0].children[1].parammaps.jwt_username = '@common.jwt_username'

      ExecDataByConfig(this.postDataPramas).then(response => {
        if (response.msg === 'fail') {
          this.$notify({
            title: '保存失败',
            message: response.data,
            type: 'warning',
            duration: 2000
          })
        } else {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '',
            message: '保存成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 确认领用
    handleUse(row) {
      // console.log(row.useStatus)
      if (row.useStatus === '未领用') {
        // this.temp = Object.assign({}, row) // copy obj
        this.dialogStatusUse = 'use'
        this.dialogFormVisibleUse = true
        this.getdataListParmUse.parammaps.id = row.id
        GetDataByName(this.getdataListParmUse).then(response => {
          this.listUse = response.data.list
          if (response.data.total) {
            this.total = response.data.total
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '已经领用，不能再次领用'
        })
      }
    },
    // 旧品录入
    handleOld(row) {
      if (row.refuseStatue) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatusOld = 'old'
        this.dialogFormVisibleOld = true
        this.getdataListParmOld.parammaps.id = row.id
        GetDataByName(this.getdataListParmOld).then(response => {
          this.listOld = response.data.list
          if (response.data.total) {
            this.total = response.data.total
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '旧品已回收'
        })
      }
    },
    // 旧品录入保存
    updateDataOld() {
      this.postDataPramas.common = { 'returnmap': '0' }
      this.postDataPramas.data = []
      this.postDataPramas.data[0] = { 'name': 'insertSpotList', 'resultmaps': { 'list': [] }}
      this.postDataPramas.data[0].resultmaps.list = this.listOld
      this.postDataPramas.data[0].children = []
      this.postDataPramas.data[0].children[0] = { 'name': 'okSAOrRefuse', 'type': 'e', 'parammaps': { }}
      this.postDataPramas.data[0].children[0].parammaps.useForm = '@insertSpotList.useForm'
      this.postDataPramas.data[0].children[0].parammaps.listType = '@insertSpotList.listType'
      this.postDataPramas.data[0].children[0].parammaps.stockNumber = '@insertSpotList.stockNumber'
      this.postDataPramas.data[0].children[0].parammaps.stockName = '@insertSpotList.stockName'
      this.postDataPramas.data[0].children[0].parammaps.pastureId = '@insertSpotList.pastureId'
      this.postDataPramas.data[0].children[0].parammaps.departmentId = '@insertSpotList.departmentId'
      this.postDataPramas.data[0].children[0].parammaps.price = '@insertSpotList.price'
      this.postDataPramas.data[0].children[0].parammaps.specification = '@insertSpotList.specification'
      this.postDataPramas.data[0].children[0].parammaps.unit = '@insertSpotList.unit'
      this.postDataPramas.data[0].children[0].parammaps.refuseNumber = '@insertSpotList.refuseNumber'
      this.postDataPramas.data[0].children[0].parammaps.useNumber = '@insertSpotList.useNumber'
      this.postDataPramas.data[0].children[0].parammaps.note = '@insertSpotList.note'
      this.postDataPramas.data[0].children[0].parammaps.providerId = '@insertSpotList.providerId'
      ExecDataByConfig(this.postDataPramas).then(response => {
        if (response.msg === 'fail') {
          this.$notify({
            title: '出库失败',
            message: response.data,
            type: 'warning',
            duration: 2000
          })
        } else {
          this.getList()
          this.dialogFormVisible = false
          this.$notify({
            title: '',
            message: '出库成功',
            type: 'success',
            duration: 2000
          })
        }
      })
      this.requestParam.name = 'okSAOrRefuse'
      console.log(this.requestParam.parammaps)
      this.requestParam.parammaps['fsion'] = this.listOld
      PostDataByName(this.requestParam).then(response => {
        if (response.msg === 'fail') {
          this.$notify({
            title: '失败',
            message: '保存失败-' + response.data,
            type: 'warning',
            duration: 2000
          })
        } else {
          this.getList()
          this.dialogFormVisibleOld = false
          this.$notify({
            title: '成功',
            message: '旧品录入成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    }
  },

  // 确认领用修改状态
  handleEnableChange(index, row) {
    this.postDataPramas.common = { 'returnmap': '0' }
    this.postDataPramas.data = []
    this.postDataPramas.data[0] = { 'name': 'updateStockUseIsRefuse', 'type': 'e', 'parammaps': {}}
    this.postDataPramas.data[0].parammaps['isRefuse'] = row.isRefuse
    this.postDataPramas.data[0].parammaps['id'] = row.id
    ExecDataByConfig(this.postDataPramas).then(response => {
      this.$notify({
        title: '成功',
        message: '修改成功',
        type: 'success',
        duration: 2000
      })
    })
  },

  // 确认领用保存
  updateDataUse() {
    console.log(this.listUse)

    this.postDataPramas.common = { 'returnmap': '0' }
    this.postDataPramas.data = []

    this.postDataPramas.data[0] = { 'name': 'insertSpotList', 'resultmaps': { 'list': [] }}
    this.postDataPramas.data[0].resultmaps.list = this.listUse
    this.postDataPramas.data[0].children = [] // updateStockAmount
    this.postDataPramas.data[0].children[0] = { 'name': 'updateStockAmount', 'type': 'e', 'parammaps': { }}
    this.postDataPramas.data[0].children[0].parammaps.stockNumber = '@insertSpotList.stockNumber'
    this.postDataPramas.data[0].children[0].parammaps.amount = '@insertSpotList.useNumber'
    this.postDataPramas.data[0].children[0].parammaps.pastureId = '@insertSpotList.pastureId'
    this.postDataPramas.data[0].children[0].parammaps.isRefuse = '@insertSpotList.isRefuse'
    this.postDataPramas.data[0].children[0].parammaps.stockId = '@insertSpotList.stockId'

    ExecDataByConfig(this.postDataPramas).then(response => {
      if (response.msg === 'fail') {
        this.$notify({
          title: '出库失败',
          message: response.data,
          type: 'warning',
          duration: 2000
        })
      } else {
        this.getList()
        this.dialogFormVisible = false
        this.$notify({
          title: '',
          message: '出库成功',
          type: 'success',
          duration: 2000
        })
      }
    })

    /*       this.requestParam.name = 'okBigStockUse'
      console.log(this.requestParam.parammaps)
      this.requestParam.parammaps['fsion'] = this.listUse
      PostDataByName(this.requestParam).then(response => {
        // console.log(response)
        if (response.msg === 'fail') {
          this.$notify({
            title: '失败',
            message: '保存失败-' + response.data,
            type: 'warning',
            duration: 2000
          })
        } else {
          this.getList()
          this.dialogFormVisibleUse = false
          this.$notify({
            title: '成功',
            message: '确认领用成功',
            type: 'success',
            duration: 2000
          })
        }
      }) */
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
