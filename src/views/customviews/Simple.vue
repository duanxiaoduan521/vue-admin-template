<template>
  <div class="center">{{ this.$route.name || "" }}</div>
</template>

<script>

export default {
  name: 'Simple',
  props: ['view']
}
</script>

