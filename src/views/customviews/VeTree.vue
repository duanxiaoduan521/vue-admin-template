<template>
  <div class="tree-view">
    <div class="tree-view-flex tree-view-header">
      <div
        v-for="(col) in columns"
        :key="col.index"
        :style="colStyle(col)"
        class="title"
      >{{ col.label }}</div>
      <div v-if="actions" :style="actionsStyle" class="title">操作</div>
    </div>
    <el-tree ref="tree" :data="rows" show-checkbox class="tree-view-box">
      <div slot-scope="{ node, data }" class="tree-view-flex tree-view-row">
        <el-table-cell
          v-for="(col) in columns"
          :key="data.index + col.index"
          :col="col"
          :row="data"
          :style="rowStyle(col)"
        />
        <div v-if="actions" :style="actionsStyle" class="tree-actions">
          <el-btn
            v-for="act in actions.items"
            :key="act.index"
            :act="act"
            :row="data"
            size="mini"
            @action="ajax"
          />
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
import ElTableCell from './elements/ElTableCell'
import ElBtn from './elements/ElBtn'

export default {
  components: {
    ElTableCell,
    ElBtn
  },
  props: ['columns', 'rows', 'actions'],
  computed: {
    actionsStyle() {
      const width = this.actions ? `${this.actions.items.length * 80}px` : 0
      return {
        width
      }
    }
  },
  methods: {
    ajax(act) {
      this.$emit('action', act)
    },
    /**
     * 重置选中行
     */
    rowSelect(s) {
      if (s) this.$refs.tree.setCheckedKeys(s)
    },
    colStyle(col) {
      const style = {
        width: col.width || '60px',
        textAlign: col.textAlign || 'center'
      }
      return style
    },
    rowStyle(col) {
      const style = {
        width: col.width || '60px'
      }

      return style
    }
  }
}
</script>

<style scoped>
.tree-view {
  flex: 1;
}
.tree-view-box {
  flex: 1;
  align-items: center;
}

.tree-view-flex {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: stretch;
  flex-direction: row;
}

.title {
  border-right : 1px solid #e0e6ed;
  white-space: nowrap;
  overflow: hidden;
  height: 40px;
  line-height: 40px;
  min-width: 0;
  text-overflow: ellipsis;
  box-sizing: border-box;
  font-size: 14px;
  color: #ffffff;
}

.tree-view-header {
  border: 1px solid #e0e6ed;
  margin-bottom: 5px;
  background-color: #1f2d3d;
}
.tree-view-header>:last-child {
  border-right: 0;
}

.tree-view-row>div {
  /* border-right: solid 1px #000000; */
  align-items: center;
  display: flex;
}
.tree-view-flex>:first-child {
  flex: 1;
}
.tree-view-row>:first-child {
  text-align: left;
}
.tree-view-row>:last-child {
  border-right: 0;
}
.tree-view-row .tree-actions {
  align-items: center;
  display: flex;
  justify-content: center;
}
.tree-view-header>div {
  text-align: center;
}
</style>

