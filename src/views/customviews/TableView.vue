<template>
  <pannel class="el-main">
    <div slot="top" class="top">
      <div>
        <el-btn
          v-for="btn in view.btns.items"
          :key="btn.label"
          :act="btn"
          :multi-select="multiSelect"
          :plain="true"
          @action="handleButton"
        />
      </div>
      <ve-form :view="view.search" class="form-inline" @search="search" />
    </div>
    <ve-table
      slot="content"
      ref="table"
      v-loading="loading"
      :rows="rows"
      :columns="view.columns"
      :actions="view.actions"
      @action="ajax"
      @edit="edit"
      @sort="sortChange"
      @multipleSelection="handleSelectionChange"
    />
    <el-pagination
      v-if="pSize > 0"
      slot="foot"
      background
      :current-page.sync="page"
      layout="total, prev, pager, next"
      :total="total"
      :page-size="pSize"
      @current-change="handleCurrentChange"
    />

  </pannel>
</template>
<script>
// import Rank from './Rank'
import Pannel from './Pannel'
import VeTable from './VeTable'
import ElBtn from './elements/ElBtn'
import VeForm from './VeForm'

const Demo = {
  columns: [
    {
      index: 'user-name',
      label: '用户名',
      name: 'name',
      colWidth: 200,
      sortable: true,
      editable: true,
      editUrl: '/table/edit/name.json'
    }, {
      index: 'user-sex',
      label: '性别',
      name: 'sex',
      colWidth: 100,
      holder: 'switch',
      activeText: '男',
      inactiveText: '女',
      activeIconClass: 'el-icon-location',
      inactiveIconClass: 'el-icon-location-outline'
    }, {
      index: 'user-year',
      label: '年龄',
      name: 'year',
      colWidth: 100
    }, {
      index: 'user-depart',
      label: '部门',
      name: 'depart',
      colWidth: 200,
      holder: 'select',
      options: [
        {
          value: 1,
          label: '第一中学'
        },
        {
          value: 2,
          label: '第二中学'
        },
        {
          value: 3,
          label: '第三中学'
        },
        {
          value: 4,
          label: '第四中学'

        }
      ]
    }, {
      index: 'user-address',
      label: '地址',
      name: 'address',
      align: 'left'
    }
  ],
  btns: {
    items: [
      {
        icon: 'el-icon-edit',
        type: 'primary',
        label: '新建',
        next: '/form.json',
        size: 'medium'
      },
      {
        icon: 'el-icon-delete',
        url: '/delete.json',
        multiSelect: true,
        type: 'danger',
        label: '删除',
        size: 'medium'
      }
    ]
  },
  department: [
    {
      label: '名称',
      name: 'name',
      index: 'department-name'
    },
    {
      label: '状态',
      name: 'sex',
      index: 'department-sex'
    },
    {
      label: '简介',
      name: 'display',
      index: 'department-display',
      width: '200px'
    }
  ],
  actions: {
    items: [
      {
        icon: 'el-icon-edit',
        next: '/form.json',
        type: 'primary',
        label: '修改'
      },
      {
        icon: ['el-icon-location-outline', 'el-icon-location'],
        switch: 'sex',
        switchUrl: ['/sex.json?sex=1', '/sex.json?sex=0'],
        label: ['女', '男'],
        type: ['primary', 'denger']
      },
      {
        icon: 'el-icon-edit',
        url: '/status.json',
        type: 'success',
        label: '状态',
        disable: 'sex'
      }
    ]
  }
}

export default {
  components: {
    Pannel,
    VeTable,
    ElBtn,
    VeForm
  },

  // mixins: [Rank],

  data() {
    return {
      // 查询
      multipleSelection: [],
      searchValues: {},
      // 排序
      sort: {},
      // action: null,
      // 分页变量
      page: 1,
      pSize: 10,
      total: 0,
      // 搜索
      formInline: {
        user: '',
        region: ''
      },
      view: {
        name: 'TableView',
        columns: Demo.columns,
        search: {
          size: 'medium',
          inline: true,
          fields: [
            {
              index: 'user-name',
              label: '用户名',
              name: 'name'
            }
          ]
        },
        btns: Demo.btns,
        actions: Demo.actions,
        url: '/table/data.json'
      }
    }
  },
  computed: {
    params() {
      const self = this
      return {
        page: self.page,
        sort: self.sort,
        search: self.searchValues
      }
    },
    multiSelect() {
      return this.multipleSelection.length !== 0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    handleButton(btn) {
      let value
      if (btn.multiSelect) value = { id: this.multipleSelection.map(r => r.id) }
      this.ajax(btn, value)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    search(form) {
      this.search = form
      this.getData()
    },
    /**
     * 相应翻页动作
     */
    handleCurrentChange() {
      this.getData()
    },
    /**
     * 排序动作
     */
    sortChange(sort) {
      if (!sort || !sort.column || !sort.column.sortable) return
      this.page = 1
      this.sort = { column: sort.column.property, order: sort.order }
      this.getData()
    },
    /**
     * 重新远程获取数据
     */
    getData() {
      // const url = this.view.url
      // this.load(url, this.params).then((data) => {
      //  this.freshTable(data)
      // })

    },
    /**
     * 刷新数据
     */
    freshTable(data) {
      if (!data) return
      if (data.rows) this.rows = data.rows
      if (data.total) this.total = data.total
      this.$nextTick(() => {
        if (data.selected) this.$refs.table.rowSelect(data.selected)
      })
    }
  }
}
</script>
<style scoped>
.top {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}
.form-inline {
  margin-bottom: -18px;
}
</style>
