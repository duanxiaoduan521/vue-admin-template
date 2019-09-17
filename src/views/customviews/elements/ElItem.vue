<template>
  <div class="el-item">
    <div class="el-item-label">
      <span>{{ label }}</span>
    </div>
    <div class="el-item-content">
      <div
        v-for="(v, index) in local"
        :key="index"
        class="el-item-value"
      >
        <el-form-field
          :value="local[index]"
          :disabled="disabled"
          :item="item"
          :index="index"
          @input="input"
        />
        <div class="el-item-remove">
          <el-button :icon="btnIcon" :type="btnType" round size="mini" @click="change(index)" />
        </div>
      </div>
      <div v-if="item.asArray" v-show="!disabled" class="el-item-add">
        <el-button type="info" @click="add">+</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import ElFormField from './ElFormField'
import ItemArray from './ItemArray'

export default {
  components: {
    ElFormField
  },
  mixins: [ItemArray],
  methods: {
    /**
     * 响应数据修改
     */
    input(index, value) {
      // console.log('input', this.item.label, index, value);
      this.$set(this.local, index, value)
      // if (this.disabled) return;
      const v = (this.item.asArray) ? this.local : this.local[0]

      this.$emit('input', this.index, this.item.name, v)
    }
  }
}
</script>

<style scoped>
  .el-item {
    display: flex;
    align-items: center;
  }

  .el-item-label {
    width: 60px;
    padding: 0 20px 0 0;
    text-align: right;
  }

  .el-item-content {
    display: flex;
    flex-direction: column;
  }

  .el-item-value {
    display: flex;
    align-items: center;
    height: 60px;
  }

  .el-item-add .el-button {
    width: 100%;
  }

  .el-item-remove {
    padding: 0 20px 0 5px;
  }
</style>
