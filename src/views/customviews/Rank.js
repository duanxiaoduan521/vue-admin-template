/**
 * 数据池
 */
const Rank = {
  data() {
    return {
      // 数据
      rows: [],
      loading: false
    }
  },
  methods: {
    /** 按钮动作
     *
     * @param {Object} action
     * @param {?Object} value
     */
    ajax(action, value) {
      // 跳转
      if (action.next) {
        this.$root.$EventBus.stack('redirect', action.next)
        return
      }

      // 提交后刷新
      this.load(action.url, value).then(() => this.getData())
    },
    /** 修改单元格
     *
     * @param {Object} row
     * @param {Object} col
     * @param {String|Number} v
     */
    edit(row, col, v) {
      this.load(col.editUrl, {
        col: col.name,
        id: row.id,
        value: v
      }).then((data) => {
        // eslint-disable-next-line
        row[col.name] = data.value;
      })
    },
    /**
     * 远程获取数据
     *
     * @param {String} url
     * @param {?Object} params
     */
    load(url, params = null) {
      this.loading = true
      return this.$HttpGet(url, params).then((data) => {
        this.loading = false
        return data
      }, () => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}

export default Rank
