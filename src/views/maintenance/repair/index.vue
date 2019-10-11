<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 搜索条件 -->
      <el-select
        v-model="getdataListParm.parammaps.pastureName"
        clearable
        placeholder="牧场"
        class="filter-item"
        style="width:150px;"
      >
        <el-option
          v-for="item in findAllPasture"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <el-input
        v-model="getdataListParm.parammaps.assetNumber"
        placeholder="资产编号"
        style="width: 140px;"
        class="filter-item"
      />
      <el-date-picker
        v-model="getdataListParm.parammaps.applyTime"
        type="date"
        placeholder="日期"
        style="width:150px;top:-4px;"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
      />

      <el-select
        v-model="getdataListParm.parammaps.statue"
        clearable
        placeholder="处理状态"
        class="filter-item"
        style="width:150px;"
      >
        <el-option
          v-for="item in getDictByName"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="getdataListParm.parammaps.auditStatue"
        clearable
        placeholder="审核状态"
        class="filter-item"
        style="width:150px;"
      >
        <el-option
          v-for="item in getDictByNameA"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        v-waves
        style
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
        @click="handleCreateBaoxiu"
      >报修</el-button>
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
      <el-table-column label="报修信息" prop="id" sortable="custom" align="center" width="230px">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">单号：</span>{{ scope.row.repairNumber }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">申请人：</span>{{ scope.row.applyName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">申请时间：</span>{{ scope.row.applyTime }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="资产信息" min-width="235px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">牧场：</span> {{ scope.row.pastureName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">资产编号：</span> {{ scope.row.assetNumber }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">牧场设备编号：</span>{{ scope.row.equipmentNumber }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">设备名称：</span>{{ scope.row.assetName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">规格型号：</span>{{ scope.row.specification }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="故障信息" min-width="180px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">故障部位：</span>{{ scope.row.partName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">故障现象：</span>{{ scope.row.appearanceName }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="接单信息" min-width="240px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">接单人：</span> {{ scope.row.empname }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">接单时间：</span>{{ scope.row.orderTime }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">维修人：</span> {{ scope.row.dispose }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">维修开始时间：</span> {{ scope.row.dealTime }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">维修结束时间：</span>{{ scope.row.stopTime }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="处理/审核" min-width="205px" align="center">
        <template slot-scope="scope">
          <span style="float:left;"><span style="font-weight:bold;">处理状态：</span>{{ scope.row.statue }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">审核人：</span>{{ scope.row.auditName }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">审核时间：</span>{{ scope.row.auditTime }}</span><br>
          <span style="float:left;"><span style="font-weight:bold;">审核状态：</span>{{ scope.row.auditStatue }}</span><br>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" style="margin-left:10px;" @click="handleUpdate(row)">查看明细</el-button>
          <el-button type="success" size="mini" style="margin-left:0;" @click="handleReceipt(row)">接单</el-button>
          <el-button type="success" size="mini" :v-if="row.dispose !== undefined && row.orderTime !== undefined" style="margin-left:0;" @click="handleRepair(row)">维修</el-button>
          <el-button type="success" size="mini" style="margin-top:10px;margin-left:0;" @click="handeleComplete(row)">维修完成</el-button>
          <el-button type="success" size="mini" style="margin-top:10px;margin-left:0;" @click="handeleExamine(row)">审核</el-button>
          <!--     <el-button type="success" size="mini" style="margin-top:10px;margin-left:0;" @click="handeleImg(row)">图片上传</el-button> -->
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
    <!-- 弹出层报修 -->
    <el-dialog
      :title="textMap[dialogStatusRepair]"
      :visible.sync="dialogFormVisibleRepair"
      :close-on-click-modal="false"
    >
      <div class="app-containerRepair">
        <el-form
          ref="temp"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="120px"
          style="width: 800px; margin-left:50px;"
        >
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
            <el-col :span="12">
              <el-form-item label="设备名称：" prop="assetName">
                <el-autocomplete
                  ref="assetName"
                  v-model="temp1.assetName"
                  value-key="assetName"
                  class="inline-input"
                  :fetch-suggestions="formNameSearch"
                  placeholder="请输入内容"
                  style="width:270px;"
                  @select="handleformNameSelect"
                >
                  <template slot-scope="{ item }">
                    <div class="name" style="display: inline;">{{ item.assetName }}</div>
                    <span class="addr">{{ item.assetNumber }}</span>
                  </template>
                </el-autocomplete>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="牧场设备编号：" prop="assetNumber">
                <el-autocomplete
                  ref="assetNumber"
                  v-model="temp1.assetNumber"
                  value-key="assetNumber"
                  class="inline-input"
                  :fetch-suggestions="formNumberSearch"
                  placeholder="请输入内容"
                  style="width:270px;"
                  @select="handleformNumberSelect"
                >
                  <template slot-scope="{ item }">
                    <div class="name" style="display: inline;">{{ item.assetName }}</div>
                    <span class="addr">{{ item.assetNumber }}</span>
                  </template>
                </el-autocomplete>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="故障部位" prop="appearanceId">
                <el-select v-model="temp.appearanceId" placeholder="故障部位" class="filter-item">
                  <el-option
                    v-for="item in findAllPart"
                    :key="item.id"
                    :label="item.partName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障现象" prop="phenomen">
                <el-select v-model="temp.phenomen" placeholder="故障现象" class="filter-item">
                  <el-option
                    v-for="item in findAllAppearance"
                    :key="item.id"
                    :label="item.appearanceName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障详情" prop="details">
                <el-input ref="details" v-model="temp.details" />
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
            ref="create"
            type="success"
            @click="createData_again()"
          >确认新增</el-button>
          <el-button
            type="primary"
            @click="dialogStatusRepair==='create'?createDataBaoxiu():updateData()"
          >确认</el-button>
          <el-button @click="dialogFormVisibleRepair = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 弹出层接单 -->
    <el-dialog
      :title="textMap[dialogStatusReceipt]"
      :visible.sync="dialogFormVisibleReceipt"
      :close-on-click-modal="false"
    >
      <div class="app-containerReceipt">
        <el-form
          ref="temp"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="150px"
          style="width: 800px; margin-left:50px;"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="资产编号：" prop="assetNumber">
                <el-input ref="assetNumber" v-model="temp.assetNumber" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产名称：" prop="assetName">
                <el-input ref="assetName" v-model="temp.assetName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="牧场设备编号：" prop="equipmentNumber">
                <el-input ref="equipmentNumber" v-model="temp.equipmentNumber" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="牧场名称：" prop="pastureName">
                <el-input ref="pastureName" v-model="temp.pastureName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门：" prop="departmentName">
                <el-input ref="departmentName" v-model="temp.departmentName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="故障部位：" prop="partName">
                <el-input ref="partName" v-model="temp.partName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障现象：" prop="appearanceName">
                <el-input ref="appearanceName" v-model="temp.appearanceName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障详情：" prop="details">
                <el-input ref="details" v-model="temp.details" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            v-if="dialogStatusReceipt==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >确认新增</el-button>
          <el-button
            type="primary"
            @click="dialogStatusReceipt==='create'?createData():updateDataReceipt()"
          >确认</el-button>
          <el-button @click="dialogFormVisibleReceipt = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 弹出层维修 -->
    <el-dialog
      :title="textMap[dialogStatusRepairW]"
      :visible.sync="dialogFormVisibleRepairW"
      :close-on-click-modal="false"
    >
      <div class="app-containerRepairW">
        <el-form
          ref="temp"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="130px"
          style="width: 800px; margin-left:50px;"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="资产编号：" prop="assetNumber">
                <el-input ref="assetNumber" v-model="temp.assetNumber" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产名称：" prop="assetName">
                <el-input ref="assetName" v-model="temp.assetName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="牧场设备编号：" prop="equipmentNumber">
                <el-input ref="equipmentNumber" v-model="temp.equipmentNumber" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="牧场名称：" prop="pastureName">
                <el-input ref="pastureName" v-model="temp.pastureName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门：" prop="departmentName">
                <el-input ref="departmentName" v-model="temp.departmentName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="故障部位：" prop="partName">
                <el-input ref="partName" v-model="temp.partName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障现象：" prop="appearanceName">
                <el-input ref="appearanceName" v-model="temp.appearanceName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障详情：" prop="details">
                <el-input ref="details" v-model="temp.details" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="责任人" prop="employeId">
                <el-select v-model="temp.employeId" placeholder="责任人" class="filter-item" :disabled="isDisabled">
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
              <el-form-item label="日期" prop="aaDate">
                <el-date-picker
                  v-model="temp.aaDate"
                  :disabled="isDisabled"
                  type="date"
                  placeholder="日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width:170px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="处理结果" prop="checkResult">
                <el-radio-group v-model="temp.checkResult" :disabled="isDisabled" @change="changeHandler">
                  <el-radio
                    v-for="item in getDictByNameResult"
                    ref="temp"
                    :key="item.id"
                    style="margin-bottom:10px;"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-radio-group>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="4">
              <el-button v-if="shengcheng" @click="handleshengcheng">生成领用单</el-button>
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
                  :disabled="isDisabled"
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
          id="myTable"
          :key="tableKey"
          v-loading="listLoading"
          :rules="rules"
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
          <!-- table表格 -->
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
                  <el-input v-show="true" v-model="scope.row.amount" style="width:80px;border:none;margin-top:25px;height:30px" :disabled="isDisabled" />
                  <!-- <input v-model="scope.row.amount" type="number" style="width:80px;border:none;margin-top:25px;height:30px"> -->
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{row}">
              <el-button type="success" size="mini" :disabled="isDisabled" @click="stockDel(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :disabled="isDisabled"
          @click="dialogStatusComplete ==='create'?createDataRepairW():createDataRepairW()"
        >确认</el-button>
        <el-button @click="dialogFormVisibleRepairW = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层查看详情 -->
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
          label-width="120px"
          style="width: 800px; margin-left:50px;"
        >
          <el-row>
            <el-col :span="8">
              <el-form-item label="资产编号：" prop="assetNumber">
                <el-input ref="assetNumber" v-model="temp.assetNumber" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="资产名称：" prop="assetName">
                <el-input ref="assetName" v-model="temp.assetName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="牧场设备编号：" prop="equipmentNumber">
                <el-input ref="equipmentNumber" v-model="temp.equipmentNumber" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="牧场名称：" prop="pastureName">
                <el-input ref="pastureName" v-model="temp.pastureName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部门：" prop="departmentName">
                <el-input ref="departmentName" v-model="temp.departmentName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="故障部位：" prop="partName">
                <el-input ref="partName" v-model="temp.partName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障现象：" prop="appearanceName">
                <el-input ref="appearanceName" v-model="temp.appearanceName" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障详情：" prop="details">
                <el-input ref="details" v-model="temp.details" disabled style="width:170px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="责任人：" prop="employeId">
                <el-select v-model="temp.employeId" placeholder="责任人" class="filter-item" disabled>
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
              <el-form-item label="日期：" prop="aaDate">
                <el-date-picker
                  v-model="temp.aaDate"
                  disabled
                  type="date"
                  placeholder="日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width:170px;"
                />
              </el-form-item>
            </el-col>
            <el-row>
              <el-col :span="14">
                <el-form-item label="处理结果" prop="checkResult">
                  <el-radio-group v-model="temp.checkResult" disabled @change="changeHandler">
                    <el-radio
                      v-for="item in getDictByNameResult"
                      :key="item.id"
                      style="margin-bottom:10px;"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row></el-form>
        <el-table
          v-if="display"
          :key="tableKey"
          v-loading="listLoading"
          element-loading-text="给我一点时间"
          :data="listchakan"
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
          <el-table-column label="数量" min-width="110px" align="center">
            <template slot-scope="scope">
              领用数量：<span>{{ scope.row.useNumber }}</span><br>
              审批数量：<span>{{ scope.row.approvalAmount }}</span><br>
              单位：<span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" min-width="110px" align="center">
            <template slot-scope="scope">
              单价：<span>{{ scope.row.price }}</span><br>
              总价：<span>{{ scope.row.sumPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="驳回原因" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.note }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否驳回" property="isReject" min-width="110px" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isReject" active-color="#13ce66" inactive-color="#ff4949" active-value="0" inactive-value="1" disabled />
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" style="float:right;">
          <el-button @click="dialogFormVisible = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 弹出层维修完成 -->
    <el-dialog
      :title="textMap[dialogStatusComplete]"
      :visible.sync="dialogFormVisibleComplete"
      :close-on-click-modal="false"
      style="width:400px;margin:0 auto;"
    >
      <div class="app-containerComplete">
        <el-form
          ref="temp"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <h3 style="margin-bottom:50px;">是否完成？</h3>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!--        <el-button
            v-if="dialogStatusComplete ==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >确认新增</el-button> -->
          <el-button
            type="primary"
            @click="dialogStatusComplete ==='create'?createData():updateDataComplete()"
          >确认</el-button>
          <el-button @click="dialogFormVisibleComplete = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 弹出层审核 -->
    <el-dialog
      :title="textMap[dialogStatusExamine]"
      :visible.sync="dialogFormVisibleExamine"
      :close-on-click-modal="false"
    >
      <div class="app-containerExamine">
        <el-form
          ref="temp"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 800px; margin-left:50px;"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="资产编号" prop="assetNumber">
                <el-input ref="assetNumber" v-model="temp.assetNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牧场名称" prop="pastureName">
                <el-input ref="pastureName" v-model="temp.pastureName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牧场设备编号" prop="equipmentNumber">
                <el-input ref="equipmentNumber" v-model="temp.equipmentNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产名称" prop="assetName">
                <el-input ref="assetName" v-model="temp.assetName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="故障现象" prop="appearanceName">
                <el-input ref="appearanceName" v-model="temp.appearanceName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="故障详情" prop="details">
                <el-input ref="details" v-model="temp.details" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="部门" prop="departmentName">
                <el-input ref="departmentName" v-model="temp.departmentName" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="故障部位" prop="partName">
                <el-input ref="partName" v-model="temp.partName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核人" prop="employeId">
                <el-select v-model="temp.employeId" placeholder="责任人" class="filter-item" disabled>
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
              <el-form-item label="审核日期" prop="aaDate">
                <el-date-picker
                  v-model="temp.aaDate"
                  disabled
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
            v-if="dialogStatusExamine==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >确认新增</el-button>
          <el-button
            type="primary"
            @click="dialogStatusExamine==='create'?createData():updateDataExamine()"
          >确认</el-button>
          <el-button @click="dialogFormVisibleExamine = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 弹出层图片上传 -->
    <el-dialog
      :title="textMap[dialogStatusImg]"
      :visible.sync="dialogFormVisibleImg"
      :close-on-click-modal="false"
    >
      <div class="app-containerImg">
        <el-form
          ref="temp"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 800px; margin-left:50px;"
        >

          <div slot="footer" class="dialog-footer">
            <el-button
              v-if="dialogStatusExamine==='create'"
              ref="createb"
              type="success"
              @click="createData_again()"
            >确认新增</el-button>
            <el-button
              type="primary"
              @click="dialogStatusImg==='create'?createData():updateDataImg()"
            >确认</el-button>
            <el-button @click="dialogFormVisibleImg = false">关闭</el-button>
          </div>
        </el-form></div>
    </el-dialog>
  </div>
</template>

<script>
// 引入
import { GetDataByName, GetDataByNames, PostDataByName, ExecDataByConfig, checkButtons } from '@/api/common'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils/index.js'
// eslint-disable-next-line no-unused-vars
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
// import { validator } from '@/utils/validate.js'
export default {
  name: 'Repair',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      buttonShow: [],
      isReject: [],
      tableKey: 0,
      isDisabled: true,
      //  shengcheng: false,
      display: false,
      radioSex: 'man',
      list: [],
      list2: [],
      listchakan: [],
      total: 0,
      radio: '',
      listLoading: true,
      maintainStockUseId: '', // 维修时点击维修按钮加载的维修主键
      state1: '',
      bigsSolrId: '', // 生成领用单时候获取的父类ID
      requestParam: {
        name: 'insertAsset',
        offset: 0,
        pagecount: 0,
        parammaps: {}
      },
      // 1-2:table&搜索传参
      getdataListParm: {
        name: 'getMaintainList',
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
      // 查看详情table
      getdataListParmchakan: {
        name: 'selectFindStock1',
        page: 1,
        offset: 1,
        pagecount: 10,
        returntype: 'Map',
        parammaps: {
          id: '',
          assetName: ''
        }
      },
      // 2-3：下拉框请求后数据加入[]
      findAllProvider: [],
      findAllAssetType: [],
      findAllPasture: [],
      findAllDepart: [],
      findAllEmploye: [],
      findAllAppearance: [],
      findAllPart: [],
      getDictByName: [],
      getDictByNameA: [],
      getDictByNameResult: [],
      // 2-1.请求下拉框接口
      requestParams: [
        { name: 'findAllProvider', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllAssetType', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllPasture', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllDepart', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllEmploye', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllAppearance', offset: 0, pagecount: 0, params: [] },
        { name: 'findAllPart', offset: 0, pagecount: 0, params: [] },
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['维修操作'] },
        { name: 'getDictByNameA', offset: 0, pagecount: 0, params: ['资产状态'] },
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['维修处理结果'] }
      ],

      requestParamAs: [
        { name: 'getDictByName', offset: 0, pagecount: 0, params: ['审核状态'] }
      ],

      temp: {
        assetNumber: '',
        assetName: ''
      },
      temp1: {
        assetNumber: '',
        assetName: ''
      },

      tempSolr: {
        assetNumber: '',
        assetName: ''
      },
      requestFilterParams: {
        returntype: 'Map',
        parammaps: {}
      },
      dialogFormVisibleRepair: false,
      dialogFormVisible: false,
      dialogFormVisibleReceipt: false,
      dialogFormVisibleRepairW: false,
      dialogFormVisibleComplete: false,
      dialogFormVisibleExamine: false,
      dialogFormVisibleImg: false,
      dialogStatusRepair: '',
      dialogStatusReceipt: '',
      dialogStatusRepairW: '',
      dialogStatus: '',
      dialogStatusComplete: '',
      dialogStatusExamine: '',
      dialogStatusImg: '',
      textMap: {
        examine: '审核',
        complete: '维修完成',
        repairW: '维修',
        receipt: '接单',
        repair: '报修',
        update: '查看详情',
        create: '新增',
        img: '图片上传'
      },
      postDataPramas: {

      },
      stockAAA: {
        stockA: '',
        stockNumber: '',
        stockName: '',
        specification: '',
        amount: '',
        note: ''
      },
      dialogPvVisible: false,
      // 校验规则
      rules: {
        amount: [{ type: 'number', required: true, validator: (rule, value, callback) => {
          // console.log(this.list2[this.list2.length - 1].repertory)
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
    console.log(this.$store.state.user.buttons)
    this.getDownList()
    this.getList()
    checkButtons(this.$store.state.user.buttons, 'baoxiu')
    console.log(this.$store.state.user.buttons)
  },
  methods: {
    // 模糊查询-报修备件信息搜索

    stockSearch(queryString, cb) {
      this.requestFilterParams.name = 'findByDimStock'
      this.requestFilterParams.parammaps = {}
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

    createDataRepairW() {
      this.postDataPramas.common = { 'returnmap': '0' }
      this.postDataPramas.data = []

      this.postDataPramas.data[0] = { 'name': 'deleteStockUse1', 'type': 'e', 'parammaps': { 'bigId': this.temp.bigId }}
      this.postDataPramas.data[1] = { 'name': 'deleteBigStockUse1', 'type': 'e', 'parammaps': { 'id': this.temp.bigId }}
      this.postDataPramas.data[2] = { 'name': 'insertBigStockUse1', 'type': 'e', 'parammaps': { }}
      this.postDataPramas.data[2].parammaps.pastureId = this.temp.pastureId
      this.postDataPramas.data[2].parammaps.departmentId = this.temp.departmentId
      this.postDataPramas.data[2].parammaps.maintainId = this.temp.id
      this.postDataPramas.data[2].parammaps.employeId1 = this.temp.disposeId
      this.postDataPramas.data[2].parammaps.oddNumber = this.temp.repairNumber
      this.postDataPramas.data[3] = { 'name': 'insertStockUse', 'resultmaps': { 'list': this.list2 }}
      this.postDataPramas.data[3].children = []
      this.postDataPramas.data[3].children[0] = { 'name': 'insertStockUse1', 'type': 'e', 'parammaps': { }}
      this.postDataPramas.data[3].children[0].parammaps.stockNumber = '@insertStockUse.stockNumber'
      this.postDataPramas.data[3].children[0].parammaps.stockName = '@insertStockUse.stockName'
      this.postDataPramas.data[3].children[0].parammaps.specification = '@insertStockUse.specification'
      this.postDataPramas.data[3].children[0].parammaps.useNumber = '@insertStockUse.amount'
      this.postDataPramas.data[3].children[0].parammaps.refuseNumber = '@insertStockUse.amount'
      this.postDataPramas.data[3].children[0].parammaps.bigId = '@insertBigStockUse1.LastInsertId'
      this.postDataPramas.data[3].children[0].parammaps.maintainId = this.temp.id

      this.postDataPramas.data[4] = { 'name': 'updateMaintainTime', 'type': 'e', 'parammaps': { }}
      this.postDataPramas.data[4].parammaps.id = this.temp.id
      this.postDataPramas.data[4].parammaps.jwt_username = '@common.jwt_username'
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

    // 刷新修改过的信息
    uplodeStockList111() {
      if (this.list.length > 0) {
        this.requestFilterParams.parammaps = {}
        this.requestFilterParams.name = 'getRepairStockList'
        this.requestFilterParams.parammaps['maintainId'] = this.maintainStockUseId
        GetDataByName(this.requestFilterParams).then(response => {
          this.list2 = response.data.list
          console.log(this.list2)
        })
      }
    },
    // 加载备件列表信息
    uplodeStockList(row) {
      if (this.list.length > 0) {
        this.requestFilterParams.parammaps = {}
        this.requestFilterParams.name = 'getRepairStockList'
        this.requestFilterParams.parammaps['maintainId'] = row.id
        this.maintainStockUseId = row.id
        GetDataByName(this.requestFilterParams).then(response => {
          this.list2 = response.data.list
        })
      }
    },

    stockDel(row) {
      this.list2.some((item, i) => {
        if (item.stockNumber === row.stockNumber) {
          this.list2.splice(i, 1)
          return true
        }
      })
    },
    // 模糊查询-报修名称
    formNumberSearch(queryString, cb) {
      this.requestFilterParams.name = 'findAssetMain'
      this.requestFilterParams.parammaps['assetNumber'] = queryString
      this.requestFilterParams.parammaps['assetName'] = ''
      GetDataByName(this.requestFilterParams).then(response => {
        cb(response.data.list)
      })
    },
    formNameSearch(queryString, cb) {
      this.requestFilterParams.name = 'findAssetMain'
      this.requestFilterParams.parammaps['assetNumber'] = ''
      this.requestFilterParams.parammaps['assetName'] = queryString
      GetDataByName(this.requestFilterParams).then(response => {
        cb(response.data.list)
      })
    },
    handleformNumberSelect(item) {
      console.log(item.assetNumber)
      this.requestFilterParams.name = 'findAssetMain'
      this.requestFilterParams.parammaps['assetName'] = ''
      this.requestFilterParams.parammaps['assetNumber'] = item.assetNumber
      GetDataByName(this.requestFilterParams).then(response => {
        this.$nextTick(() => {
          if (response.data.list.length > 0) {
            console.log('list信息为：' + response.data.list[0].assetNumber + response.data.list[0].assetName)
            this.temp1.assetNumber = response.data.list[0].assetNumber
            this.temp1.assetName = response.data.list[0].assetName
          }
        })
      })
    },
    handleformNameSelect(item) {
      console.log(item.assetName)
      this.requestFilterParams.name = 'findAssetMain'
      this.requestFilterParams.parammaps['assetNumber'] = ''
      this.requestFilterParams.parammaps['assetName'] = item.assetName
      GetDataByName(this.requestFilterParams).then(response => {
        this.$nextTick(() => {
          if (response.data.list.length > 0) {
            console.log('list信息为：' + response.data.list[0].assetNumber + response.data.list[0].assetName)
            this.temp1.assetNumber = response.data.list[0].assetNumber
            this.temp1.assetName = response.data.list[0].assetName
          }
        })
      })
    },
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
        this.isReject = response.data.list
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
        this.findAllAppearance = response.data.findAllAppearance.list
        this.findAllPart = response.data.findAllPart.list
        this.getDictByName = response.data.getDictByName.list
        this.getDictByNameA = response.data.getDictByName.list
        this.getDictByNameResult = response.data.getDictByName.list
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
    getNowTime() {
      var now = new Date()
      var year = now.getFullYear() // 得到年份
      var month = now.getMonth() // 得到月份
      var date = now.getDate() // 得到日期
      console.log(now)
      month = month + 1
      month = month.toString().padStart(2, '0')
      date = date.toString().padStart(2, '0')
      var defaultDate = `${year}-${month}-${date}`
      this.$set(this.inputDatetime, 'date', defaultDate)
    },
    // 报修
    handleCreateBaoxiu() {
      this.resetTemp()
      this.dialogStatusRepair = 'create'
      this.dialogFormVisibleRepair = true
      /*  this.$nextTick(() => {
        this.$refs['temp'].clearValidate()
      }) */
    },
    createDataBaoxiu() {
      // this.$refs['temp'].validate(valid => {
      // if (valid) {
      this.requestParam.name = 'insertRepairs'
      this.requestParam.parammaps = this.temp
      this.requestParam.parammaps['assetNumber'] = this.temp1.assetNumber
      this.requestParam.parammaps['assetName'] = this.temp1.assetName
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
            message: '报修成功',
            type: 'success',
            duration: 2000
          })
        }
        // })
        // }
      })
    },

    // 接单
    handleReceipt(row) {
      this.temp = Object.assign({}, row) // copy obj
      if (row.empname === undefined && row.orderTime === undefined) {
        this.dialogStatusReceipt = 'receipt'
        this.dialogFormVisibleReceipt = true
      } else {
        this.$notify({
          title: '',
          message: '此单已经有人接了...',
          type: 'warning',
          duration: 2000
        })
      }
    },
    updateDataReceipt() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'receivingOrder'
          this.requestParam.parammaps = this.temp
          this.requestParam.parammaps['assetName'] = this.temp1.assetName
          this.requestParam.parammaps['assetNumber'] = this.temp1.assetNumber
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
              this.dialogFormVisibleReceipt = false
              this.$notify({
                title: '成功',
                message: '接单成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },

    // 维修
    handleRepair(row) {
      console.log(row.receiveStatue)
      // eslint-disable-next-line eqeqeq
      if (row.receiveStatue == '未审核' || row.receiveStatue == undefined) {
        this.$nextTick(() => {
          this.isDisabled = false
        })
      } else {
        this.$nextTick(() => {
          this.isDisabled = true
        })
      }
      if (row.empname !== undefined && row.orderTime !== undefined) {
      // if (row.dealTime == null) {
        this.uplodeStockList(row)
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatusRepairW = 'repairW'
        this.dialogFormVisibleRepairW = true
        this.$nextTick(() => {
          // 从后台获取时row.checkResult === '需要备件'
          if (row.checkResult === '需要备件') {
            this.display = true
          } else {
            this.display = false
          }
        })
        this.$message({
          type: 'warning',
          message: '此单正在维修...'
        })
      } else {
        this.$message({
          type: 'warning',
          message: '未接单，不能维修'
        })
      }
    },
    // 领用单以及表格显示隐藏
    changeHandler(value) {
      if (value === '无故障' || value === '已处理不需要备件') {
        this.display = false
        this.requestParam.name = 'clearBigAndStockUse'
        this.requestParam.parammaps = {}
        this.requestParam.parammaps['id'] = this.temp.id
        console.log('asdfghjk:' + this.temp.id)
        PostDataByName(this.requestParam).then(() => {
        })
      } else if (value === '需要备件') {
        this.display = true
      }
    },

    /*     handleshengcheng() {
      this.display = true
      this.requestParam.name = 'insertBigStockUse1'
      this.requestParam.parammaps = this.temp
      this.requestParam.parammaps.isOrNo = '1'
      GetDataByName(this.requestParam).then(response => {
        console.log(response)

        this.bigsSolrId = response.data.list[0].bigId

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
            message: '成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    }, */

    updateDataRepair() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'updateRepairs'
          this.requestParam.parammaps = this.temp
          this.requestParam.parammaps['assetName'] = this.temp1.assetName
          this.requestParam.parammaps['assetNumber'] = this.temp1.assetNumber
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
    },
    // 查看详情
    handleUpdate(row) {
      console.log(row.id)
      this.getdataListParmchakan.parammaps.id = row.id
      GetDataByName(this.getdataListParmchakan).then(response => {
        this.listchakan = response.data.list
        console.log(response.data.list)
        if (response.data.total) {
          this.total = response.data.total
        }
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 100)
      })
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // console.log(row.checkResult)
        // 从后台获取时row.checkResult === '需要备件'
        if (row.checkResult === '需要备件') {
          this.display = true
        } else {
          this.display = false
        }
      })
    },
    updateDataModify() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'updateRepairs'
          this.requestParam.parammaps = this.temp
          this.requestParam.parammaps['assetName'] = this.temp1.assetName
          this.requestParam.parammaps['assetNumber'] = this.temp1.assetNumber
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
    },
    // 维修完成
    handeleComplete(row) {
      if (row.stopTime === undefined) {
        this.temp = row
        // this.temp = Object.assign({}, row); // copy obj
        this.dialogStatusComplete = 'complete'
        this.dialogFormVisibleComplete = true
      } else {
        this.$message({
          type: 'warning',
          message: '维修已完成！！'
        })
      }
    },
    updateDataComplete() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'finishByIdMaintain'
          this.requestParam.parammaps = this.temp
          this.requestParam.parammaps['assetName'] = this.temp1.assetName
          this.requestParam.parammaps['assetNumber'] = this.temp1.assetNumber
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
              this.dialogFormVisibleComplete = false
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
    },
    // 审核
    handeleExamine(row) {
      if (row.stopTime !== undefined && row.auditStatue === '未审核') {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatusExamine = 'examine'
        this.dialogFormVisibleExamine = true
      } else {
        this.$message({
          type: 'warning',
          message: '此条信息已审核！！'
        })
      }
    },
    updateDataExamine() {
      this.$refs['temp'].validate(valid => {
        if (valid) {
          this.requestParam.name = 'maintainCheck'
          this.requestParam.parammaps = this.temp
          this.requestParam.parammaps['isOrNo'] = '0'
          this.requestParam.parammaps['assetName'] = this.temp1.assetName
          this.requestParam.parammaps['assetNumber'] = this.temp1.assetNumber
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
              this.dialogFormVisibleExamine = false
              this.$notify({
                title: '成功',
                message: '审核成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 图片上传
    handeleImg(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusImg = 'img'
      this.dialogFormVisibleImg = true
    },
    handleDelete(row) {
      MessageBox.confirm('设备名称：' + row.equipmentName, '确认删除？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.requestParam.name = 'deleteAsset'
          this.requestParam.parammaps = {}
          this.requestParam.parammaps['id'] = row.id
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
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
