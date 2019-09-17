<template>
  <span>
    <el-button
      v-show="!visible"
      type="primary"
      @click="handleExtend"
    >添加</el-button>
    <el-dialog
      :visible.sync="visible"
      :modal="false"
      width="60%"
      @open="reset"
    >
      <div slot="title" />
      <el-item-group
        :label="schema.title"
        :value="value"
        :item="schema.item"
        @input="input"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="extend">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import ElItemGroup from './ElItemGroup'

export default {
  name: 'ElItemInsert',
  components: {
    ElItemGroup
  },
  props: ['schema'],
  data() {
    return {
      visible: false,
      value: {}
    }
  },
  methods: {
    handleExtend() {
      this.visible = true
    },
    extend() {
      // 无标签不添加
      const v = JSON.parse(JSON.stringify(this.value))
      this.$emit('extend', v)
      this.visible = false
    },
    reset() {
      // 重置
      this.value = {}
      // this.visible = false;
    },
    input(index, label, value) {
      // console.log(index, label, value);
      this.value = value
    }
  }
}
</script>

<style scoped>
  span {
    padding-right: 10px;
  }
</style>
