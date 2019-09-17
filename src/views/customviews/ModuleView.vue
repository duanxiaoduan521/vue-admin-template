<template>
  <pannel class="el-main">
    <div slot="content" class="module-item">
      <el-item-group
        :item="view.item"
        :label="view.label"
        :value="view.value"
        :extend="view.extend"
      >
        <el-button
          slot="btns"
          type="primary"
          @click="post"
        >{{ view.item.submitLabel||'提交' }}</el-button>
      </el-item-group>
    </div>
  </pannel>
</template>

<script>
import Pannel from './Pannel'
import ElItemGroup from './elements/ElItemGroup'
// import ElItemInsert from './elements/ElItemInsert'
import View from './View'

export default {
  components: {
    Pannel,
    ElItemGroup
    //,  ElItemInsert
  },
  extends: View,
  methods: {
    post() {
      console.log(this.view.value)
      this.$root.$HttpPost(this.view.url, this.view.value)
    }
  }
}
</script>
