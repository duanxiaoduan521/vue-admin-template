<script>
export default {
  props: {
    label: String,
    item: {
      type: Object,
      default: () => {}
    },
    value: {
      default: null
    },
    index: {
      type: [String, Number],
      default: undefined
    }
  },
  data() {
    return {
      // 开始不监视local变化
      disabled: true,
      // 本地值 local ===  value
      local: []
    }
  },
  computed: {
    btnType() {
      return (this.disabled ? 'primary' : 'danger')
    },
    btnIcon() {
      return `el-icon-${(this.disabled ? 'edit' : 'minus')}`
    }
  },
  watch: {
    /**
     * 处理父组件向下传递
     */
    value() {
      this.resetLocal()
    }
  },
  created() {
    this.disabled = !this.item.must
    this.resetLocal()
  },
  methods: {
    /**
     * 重置Local
     */
    resetLocal() {
      // console.log('default', this.item.label, this.value);

      if (this.value !== null && typeof this.value !== 'undefined') {
        this.local = (this.item.asArray) ? this.value : [this.value]
        return
      }

      this.local = []
      this.actRemove()
    },
    /**
     * 新建空数据
     */
    add() {
      if (
        this.item.holder === 'pair' ||
        this.item.holder === 'item-group'
      ) this.local.push({})
      else this.local.push(null)
    },
    /**
     * 启用/删除 按钮
     */
    change(index) {
      if (this.disabled) {
        // console.log(this.item.label, 'change');
        this.disabled = false
        return
      }
      this.handleRemove(index)
    },
    /**
     * 删除数据
     */
    handleRemove(index) {
      if (this.disabled) return
      // 删除
      // console.log(this.item.label, 'remove value  by index', index);
      this.local.splice(index, 1)
      // 赋值为默认值用于占位并禁用
      if (this.local.length === 0) {
        this.actRemove()
        // return;
      }
    },
    /**
     * 发送删除本项动作
     */
    actRemove() {
      this.add()
      this.disabled = true
      // console.log(this.item.label, 'removed', this.local);
      this.$emit('remove', this.item.name, this.index)
    }
  }
}
</script>

