<template>
  <div class="el-aside">
    <slot name="prefix" />
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <template v-for="menu in menus">
        <el-submenu v-if="menu.items" :key="menu.index" :index="menu.index">
          <template slot="title"><i :class="getIcon(menu.icon)" />{{ menu.label }}</template>
          <el-menu-item
            v-for="item in menu.items"
            :key="item.index"
            :index="item.index"
            @click="send(item)"
          >
            <i :class="getIcon(item.icon)" />{{ item.label }}
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else :key="menu.index" :index="menu.index" @click="send(menu)">
          <i :class="getIcon(menu.icon)" />{{ menu.label }}
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: ['menus'],
  methods: {
    send(item) {
      this.$emit('redirect', item)
    },
    getIcon(icon = 'el-icon-menu') {
      return icon
    }
  }
}
</script>

<style scoped>
/*去掉菜单最右边的白框，个人习惯*/
.el-menu {
  border-right: 0;
  text-align: left;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
}
</style>
