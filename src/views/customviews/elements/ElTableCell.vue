<template>
  <div @dblclick="x">
    <input
      v-if="col.editable && onEdit"
      v-model.lazy="value"
      style="border:0; height:40px; width: 100%"
    >
    <span v-else><i v-if="icon" :class="icon" />{{ label }}</span>
  </div>
</template>

<script>
export default {
  props: {
    col: Object,
    row: Object
  },
  data() {
    const v = this.row[this.col.name]
    return {
      onEdit: false,
      value: v
    }
  },
  computed: {
    label() {
      const v = this.row[this.col.name]
      // 默认情况
      if (!this.col.holder) return v
      // switch
      if (this.col.holder === 'switch') {
        return v ? this.col.activeText : this.col.inactiveText
      }
      if (this.col.holder === 'radio-group' ||
        this.col.holder === 'checkbox-group' ||
        this.col.holder === 'select'
      ) {
        return this.col.options.find(item => item.value === v).label
      }
      return v
    },
    icon() {
      const v = this.row[this.col.name]
      if (this.col.holder === 'switch') {
        return v ? this.col.activeIconClass : this.col.inactiveIconClass
      }
      return undefined
    }
  },
  watch: {
    value() {
      this.$emit('edit', this.row, this.col, this.value)
      this.onEdit = false
    }
  },
  methods: {
    x() {
      this.onEdit = !this.onEdit
    },
    blur() {
      this.onEdit = false
    }
  }
}
</script>
<style scoped>
input {
  height: 30px;
  border: #ffffff 1px solid;
  float: left;
  zoom:1;
  outline: none;
}
</style>

