<template>
  <el-dropdown trigger="click" @command="exeCommand">
    <slot name="prefix" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="item of commands"
        :key="item.index"
        :divided="item.divided"
        :command="item"
      >
        <span>{{ item.label }}</span>
      </el-dropdown-item>
    </el-dropdown-menu>
    <slot name="suffix" />
  </el-dropdown>
</template>

<script>
export default {
  props: {
    commands: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    exeCommand(cmd) {
      this.$emit('redirect', cmd)
    }
  }
}
</script>

<style scoped>
</style>
