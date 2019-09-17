<template>
  <pannel>
    <component
      :is="item.name"
      v-for="item in view.items"
      :key="item.index"
      :slot="item.slot"
      :view="item"
    />
  </pannel>
</template>

<script>
import Pannel from './Pannel'
import View from './View'

export default {
  components: [
    Pannel
  ],
  extends: View
}
</script>
