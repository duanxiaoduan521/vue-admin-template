<template>
  <pannel class="el-main">
    <ve-form slot="content" :view="view" :value="value" />
  </pannel>
</template>
<script>
import Pannel from './Pannel'
import VeForm from './VeForm'
import View from './View'

export default {
  components: {
    Pannel,
    VeForm
  },
  extends: View,
  data() {
    return {
      value: {}
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
