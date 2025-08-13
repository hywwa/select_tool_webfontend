<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>
<style>
/* 只对表格内容区的单元格应用省略样式，排除表头 */
.table-ellipsis .el-table__body .el-table__cell > .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 可根据需要设置默认最大宽度 */
  max-width: 200px;
}

</style>
