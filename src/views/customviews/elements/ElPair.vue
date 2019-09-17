<template>
  <el-row>
    <el-col :span="10">
      <el-input :value="value.key" :disabled="disabled" @change="setKey" /></el-col>
    <el-col :span="4" class="devide"><hr></el-col>
    <el-col :span="10">
      <el-input :value="value.value" :disabled="disabled" @change="setValue" /></el-col>
  </el-row>
</template>

<script>
/**
 * 通过v-model来传递数据
 */
export default {
  props: {
    value: {
      type: Object,
      default() {
        return { key: '', value: null }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    r: {
      type: Object,
      default() {
        return { key: 'key', value: 'value' }
      }
    }
  },
  methods: {
    setValue(v) {
      this.$set(this.value, 'value', v)
      this.$emit('change', this.value)
    },
    setKey(v) {
      this.$set(this.value, 'key', v)
      this.send()
    },
    send() {
      if (this.value !== null) {
        const r = {}
        r[this.r.key] = this.value.key
        r[this.r.value] = this.value.value
        this.$emit('change', r)
      }
    }
  }
}
</script>

<style>
.devide {
  padding: 10px 20px 0 20px;
}
</style>
