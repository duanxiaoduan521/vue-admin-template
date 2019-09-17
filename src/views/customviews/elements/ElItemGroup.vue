<template>
  <div class="el-item-group" :style="style">
    <el-card class="el-item-group-card">
      <div slot="header" style="height: 36px" :dbclickfunc="handleShow">
        <span style="float:left;">{{ label }}</span>
        <span style="float:right;">
          <el-item-insert
            v-if="extend"
            :schema="extend"
            @extend="addItem"
          >添加</el-item-insert>
          <slot name="btns" />
        </span>
      </div>
      <div v-show="show" class="el-item-group-content">
        <div
          v-for="(v, index) in local"
          :key="index"
          class="el-item-group-value"
        >
          <div class="el-item-group-contant">
            <div
              v-for="(ele) in items"
              v-show="!(ele.on) || local[index][ele.on.name] === ele.on.value"
              :key="ele.name"
              class="el-item-group-line"
            >
              <el-item
                v-if="ele.holder !== 'item-group'"
                :item="ele"
                :label="ele.label || ele.name"
                :value="v[ele.name]"
                :index="index"
                @input="input"
                @remove="removeItem"
              />
              <el-item-group
                v-else
                :item="ele"
                :label="ele.label || ele.name"
                :value="v[ele.name]"
                :index="index"
                :extend="extend"
                @input="input"
                @remove="removeItem"
              />
            </div>
            <div v-if="item.asArray" class="el-item-remove">
              <el-button :icon="btnIcon" :type="btnType" round size="mini" @click="change(index)" />
            </div>
          </div>
        </div>
        <div v-if="item.asArray" v-show="!disabled" class="el-item-add">
          <el-button type="info" @click="add">+</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import ElItem from './ElItem'
import ItemArray from './ItemArray'

export default {
  name: 'ElItemGroup',
  components: {
    ElItem
  },
  mixins: [ItemArray],
  props: ['extend'],
  data() {
    const items = (this.item.items)
      ? JSON.parse(JSON.stringify(this.item.items)) : []
    return {
      show: true,
      items
    }
  },
  computed: {
    btnShow() {
      return (this.show ? '收起' : '展开')
    },
    style() {
      return {
        paddingLeft: '20px'
      }
    },
    itemShow(ele, index) {
      return !(ele.on) || this.local[index][ele.on.name] === ele.on.value
    }
  },
  beforeCreate() {
    // 官方文档给出的是require
    // this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue')
    // 在基于vue-cli@2.8.1按照上面的写法还是会报错
    // Failed to mount component: template or render function not defined.
    // 所以我们应该改为基于es6的写法异步加载一个组件如下
    this.$options.components.ElItemInsert = () => import('./ElItemInsert.vue')
  },
  methods: {
    /**
     * 收起/显示详细信息
     */
    handleShow() {
      this.show = !this.show
    },
    removeItem(name, index) {
      this.$delete(this.local[index], name)
    },
    addItem(schema) {
      console.log('add', this.item.name, schema)
      if (!this.items) this.$set(this, 'items', [])
      this.items.push(schema)
    },
    /**
     * 响应数据修改
     */
    input(index, name, value) {
      // if (this.disabled) return;
      // console.log('input', this.item.label, index, name, value);

      this.$set(this.local[index], name, value)

      const v = this.item.asArray ? this.local : this.local[0]

      this.$emit('input', this.index, this.item.name, v)
    }
  }
}
</script>

<style scoped>
.el-item-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.el-item-group-label {
  display: flex;
  justify-content: center;
  flex-direction: row;
  border-bottom: 1px solid #666666;
}

.el-item-group-label .title{
  height: 30px;
  line-height: 28px;
  border-bottom: 1px solid #666666;
}

.el-item-remove .el-button, .el-item-add .el-button {
  width: 100%;
}
</style>

