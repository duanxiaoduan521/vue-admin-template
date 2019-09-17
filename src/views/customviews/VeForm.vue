<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="formdata"
    :inline="view.inline"
    :label-width="view.labelWidth || '80px'"
    :style="view.style"
    :size="view.size"
  >
    <el-form-item
      v-for="field of view.fields"
      :key="field.index"
      :label="field.label"
      :prop="field.name"
    >
      <el-form-field
        :item="field"
        :value="formdata[field.name]"
        :index="field.name"
        @input="input"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">{{ btnLabel }}</el-button>
      <el-button v-if="!view.inline" @click="handleReset">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import ElFormField from './elements/ElFormField'

export default {
  components: {
    ElFormField
  },
  props: {
    view: Object,
    value: Object,
    beforeSubmit: {
      type: Function,
      default: null
    },
    afterSubmit: {
      type: Function,
      default: null
    }
  },
  data() {
    const rules = {}
    const formdata = this.value || {}
    const self = this
    this.view.fields.forEach((field) => {
      this.$set(
        formdata,
        field.name,
        formdata[field.name] === undefined ? '' : formdata[field.name],
      )
      if (!field.rule) return
      const rule = field.rule
      rule.forEach((element) => {
        // eslint-disable-next-line
        if (element.validator) element.validator = self[element.validator];
      })
      this.$set(rules, field.name, rule)
    })
    return {
      rules,
      formdata
    }
  },
  computed: {
    btnLabel() {
      return this.view.inline ? '搜索' : '提交'
    }
  },
  created() {
  },
  methods: {
    handleReset() {
      this.$refs.form.resetFields()
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return this.$notify.error({
            title: '消息',
            message: '数据验证未通过'
          })
        }

        // 内联搜索表单
        if (this.view.inline) return this.$emit('search', this.formdata)

        // POST提交
        if (this.beforeSubmit) this.formdata = this.beforeSubmit(this.formdata)
        return this.$HttpPost(this.view.url, this.formdata).then((data) => {
          if (this.afterSubmit) this.afterSubmit(data)
          else {
            const next = (data && data.next) || this.view.next || undefined
            if (next) this.$root.$EventBus.stack('redirect', next)
          }
        })
      })
    },
    validatePassword(rule, value, callback) {
      if (value !== rule.name) {
        callback(new Error(rule.message || '两次输入密码不一致!'))
      } else {
        callback()
      }
    },
    validateAsync(rule, value, callback) {
      this.$HttpGet(rule.url, { rule, value }).then((data) => {
        if (data.status) {
          callback()
        } else {
          callback(new Error(rule.message))
        }
      }, () => callback(new Error(rule.message)))
    },
    input(field, value) {
      this.$set(this.formdata, field, value)
    }
  }
}
</script>
