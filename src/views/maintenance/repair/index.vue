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
        @click="handleCreateRepair"
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
      <el-table-column label="牧场" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报修单编号" prop="id" sortable="custom" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.repairNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="牧场设备编号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.equipmentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资产编号" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.assetNumber }}</span>
        </template>
      </el-table-column>

      <el-table-column label="设备名称" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.assetName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格型号" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="故障部位" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.part }}</span>
        </template>
      </el-table-column>
      <el-table-column label="故障现象" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appearance }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="接单人" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dispose }}</span>
        </template>
      </el-table-column>
      <el-table-column label="接单时间" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修开始时间" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dealTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="维修结束时间" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stopTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理状态" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.auditStatue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="450" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="success" size="mini" @click="handleReceipt(row)">接单</el-button>
          <el-button type="success" size="mini" @click="handleRepair(row)">维修</el-button>
          <el-button type="success" size="mini" @click="handeleComplete(row)">维修完成</el-button>
          <el-button type="success" size="mini" @click="handeleExamine(row)">审核</el-button>
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
            <el-col :span="8">
              <el-form-item label="设备名称：" prop="assetName">
                <el-autocomplete
                  ref="assetName"
                  v-model="temp.assetName"
                  value-key="assetName"
                  class="inline-input"
                  :fetch-suggestions="formNameSearch"
                  placeholder="请输入内容"
                  :disabled="dialogStatus==='update'"
                  @select="handleformNameSelect"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="牧场设备编号：" prop="assetNumber">
                <el-autocomplete
                  ref="assetNumber"
                  v-model="temp.assetNumber"
                  value-key="assetNumber"
                  class="inline-input"
                  :fetch-suggestions="formNumberSearch"
                  placeholder="请输入内容"
                  :disabled="dialogStatus==='update'"
                  @select="handleformNumberSelect"
                />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="故障部位" prop="pastureId">
                <el-select v-model="temp.pastureId" placeholder="故障部位" class="filter-item">
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
                <el-select v-model="temp.departmentId" placeholder="故障现象" class="filter-item">
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
          <el-button type="primary" @click="dialogStatusRepair==='create'?createData():updateData()">确认</el-button>
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
          label-width="100px"
          style="width: 800px; margin-left:50px;"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="牧场设备编号" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牧场名称" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牧场设备编号" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产名称" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="故障部位" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="故障现象" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="故障详情" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="部门" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="报修图片" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
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
          <el-button type="primary" @click="dialogStatusReceipt==='create'?createData():updateData()">确认</el-button>
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
          label-width="100px"
          style="width: 800px; margin-left:50px;"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="牧场设备编号" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牧场名称" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牧场设备编号" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产名称" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="故障现象" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报修图片" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="部门" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作" prop="stockName">
                <el-select
                  v-model="getdataListParm.parammaps.auditStatue"
                  clearable
                  placeholder="操作"
                  class="filter-item"
                >
                  <el-option
                    v-for="item in getDictByNameA"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="故障详情" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="处理结果" prop="stockNumber">
                <el-radio-group v-model="radio">
                  <el-radio :label="3">备选项</el-radio>
                  <el-radio :label="6">备选项</el-radio>
                  <el-radio :label="9">备选项</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
          <!-- table表格 -->
          <el-table-column label="名称" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编码" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="success" size="mini" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form
          ref="temp"
          :model="temp"
          label-position="right"
          label-width="100px"
          style="width: 800px; margin-left:50px;margin-top:30px"
        >
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
            v-if="dialogStatusRepairW==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >确认新增</el-button>
          <el-button type="primary" @click="dialogStatusRepairW==='create'?createData():updateData()">确认</el-button>
          <el-button @click="dialogFormVisibleRepairW = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 弹出层修改 -->
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
            <el-col :span="6">
              <el-form-item label="牧场设备编号" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牧场名称" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牧场设备编号" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产名称" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="故障现象" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报修图片" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="故障详情" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="处理结果" prop="stockNumber">
                <el-radio-group v-model="radio">
                  <el-radio :label="3">备选项</el-radio>
                  <el-radio :label="6">备选项</el-radio>
                  <el-radio :label="9">备选项</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
          <!-- table表格 -->
          <el-table-column label="名称" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编码" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="110px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.pastureName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="success" size="mini" @click="handleDelete(row)">删除</el-button>
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
              <el-form-item label="处理人" prop="employeId">
                <el-select v-model="temp.employeId" placeholder="处理人" class="filter-item">
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
          <el-button
            v-if="dialogStatusComplete ==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >确认新增</el-button>
          <el-button type="primary" @click="dialogStatusComplete ==='create'?createData():updateData()">确认</el-button>
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
              <el-form-item label="牧场编号" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牧场名称" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="牧场设备编号" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="资产名称" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="故障现象" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="报修图片" prop="stockName">
                <el-input ref="stockName" v-model="temp.stockName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="部门" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="操作" prop="stockName">
                <el-select
                  v-model="getdataListParm.parammaps.auditStatue"
                  clearable
                  placeholder="操作"
                  class="filter-item"
                >
                  <el-option
                    v-for="item in getDictByNameA"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="故障详情" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核图片" prop="stockNumber">
                <el-input ref="stockNumber" v-model="temp.stockNumber" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-button size="small" type="primary">点击上传</el-button>
          <el-row>
            <el-col :span="8">
              <el-form-item label="审核人" prop="employeId">
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
              <el-form-item label="审核日期" prop="inputDatetime">
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
            v-if="dialogStatusExamine==='create'"
            ref="createb"
            type="success"
            @click="createData_again()"
          >确认新增</el-button>
          <el-button type="primary" @click="dialogStatusExamine==='create'?createData():updateData()">确认</el-button>
          <el-button @click="dialogFormVisibleExamine = false">关闭</el-button>
        </div>
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
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { MessageBox } from 'element-ui'
export default {
  name: 'Repair',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      radio: '',
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

      temp: {
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
      dialogStatusRepair: '',
      dialogStatusReceipt: '',
      dialogStatusRepairW: '',
      dialogStatus: '',
      dialogStatusComplete: '',
      dialogStatusExamine: '',
      textMap: {
        examine: '审核',
        complete: '维修完成',
        repairW: '维修',
        receipt: '接单',
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
  created() {
    this.getDownList()
    this.getList()
  },

  methods: {
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
      this.requestFilterParams.name = 'findAssetMain'
      this.requestFilterParams.parammaps['assetName'] = ''
      this.requestFilterParams.parammaps['assetNumber'] = this.temp.assetNumber
      GetDataByName(this.requestFilterParams).then(response => {
        this.$nextTick(() => {
          if (response.data.list.length > 0) {
            // this.temp.assetNumber = response.data.list[0].assetNumber
            // this.temp.assetName = response.data.list[0].assetName
            this.temp.assetNumber = item.assetNumber
            this.temp.assetName = item.assetName
          }
        })
      })
    },
    handleformNameSelect(item) {
      this.requestFilterParams.name = 'findAssetMain'
      this.requestFilterParams.parammaps['assetNumber'] = ''
      this.requestFilterParams.parammaps['assetName'] = this.temp.assetName
      GetDataByName(this.requestFilterParams).then(response => {
        this.$nextTick(() => {
          if (response.data.list.length > 0) {
            this.temp.assetNumber = item.assetNumber
            this.temp.assetName = item.assetName
            // this.temp.assetNumber = response.data.list[0].assetNumber
            // this.temp.assetName = response.data.list[0].assetName
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
    // 报修
    handleCreateRepair(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusRepair = 'repair'
      this.dialogFormVisibleRepair = true
      // this.$nextTick(() => {
      //   this.$refs["temp"].clearValidate();
      // });
    },
    // 接单
    handleReceipt(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusReceipt = 'receipt'
      this.dialogFormVisibleReceipt = true
    },
    // 维修
    handleRepair(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusRepairW = 'repairW'
      this.dialogFormVisibleRepairW = true
    },
    // 修改
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    // 维修完成
    handeleComplete(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusComplete = 'complete'
      this.dialogFormVisibleComplete = true
    },
    // 审核
    handeleExamine(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatusExamine = 'examine'
      this.dialogFormVisibleExamine = true
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

// .filter-container .filter-item{
//   width: 140px;
// }
// .el-button--primary{
//   width: 70px;
// }
</style>
