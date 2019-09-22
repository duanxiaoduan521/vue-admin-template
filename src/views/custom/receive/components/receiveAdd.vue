<template>
  <div class="receive-content">
    <el-form
      ref="typeTemp"
      :model="typeTemp"
      label-position="right"
      label-width="100px"
      style="width: 800px; margin-left:50px;"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="清单类型" prop="pastureId">
            <el-select v-model="typeTemp.pastureId" placeholder="清单类型" class="filter-item">
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
          <el-form-item label="名称或编号" prop="providerId">
            <el-autocomplete
              v-model="typeTemp.providerName"
              value-key="name"
              class="inline-input"
              :fetch-suggestions="providerSearch"
              placeholder="请输入名称或编号"
              style="width:200px"
              @select="handleSelect"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      element-loading-text="给我一点时间"
      :data="typeTemp.list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-bottom:20px;"
      class="elTable"
    >
      <!-- table表格 -->
      <el-table-column label="名称" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pastureName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="id" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.assetNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" min-width="130px" align="center">
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.num"
            :min="1"
            :max="10"
            style="width:120px"
            @change="handleChange"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form
      ref="temp"
      :model="typeTemp"
      label-position="right"
      label-width="100px"
      style="width: 800px; margin-left:50px;"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="牧场" prop="pastureId">
            <el-select v-model="typeTemp.pastureId" placeholder="牧场" class="filter-item">
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
            <el-select v-model="typeTemp.departmentId" placeholder="部门" class="filter-item">
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
          <el-form-item label="申请人" prop="employeId">
            <el-select v-model="typeTemp.employeId" placeholder="申请人" class="filter-item">
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
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button ref="createb" type="success" @click="createData_again()">确认新增</el-button>
      <el-button type="primary">确认</el-button>
      <el-button @click="dialogFormVisible = false">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReceiveAdd',
  props: {
    typeTemp: Object
  },
  data() {
    return {
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
      ]
    }
  },
  methods: {
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
    }
  }
}
</script>

<style>
</style>
