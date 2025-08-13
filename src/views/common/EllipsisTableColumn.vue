<template>
  <!-- 通用带悬浮提示的表格列组件 -->
  <el-table-column
      :label="label"
      :align="align"
      :width="width"
      :prop="prop"
  >
    <template #default="scope">
      <!-- 处理更新时间这类有自定义模板的情况 -->
      <el-tooltip
          effect="dark"
          :content="getContent(scope)"
          placement="top-start"
          :disabled="!shouldShowTooltip(scope)"
      >
        <div class="cell-content">
          <!-- 如果有自定义内容则使用自定义内容，否则直接显示字段值 -->
          <template v-if="$slots.default">
            <slot name="default" v-bind="scope" />
          </template>
          <template v-else>
            {{ scope.row[prop] }}
          </template>
        </div>
      </el-tooltip>
    </template>
  </el-table-column>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  prop: {
    type: String,
    required: true
  },
  align: {
    type: String,
    default: 'center'
  },
  width: {
    type: [Number, String],
    default: ''
  }
})

// 获取提示框内容
const getContent = (scope) => {
  // 优先使用插槽内容的文本形式
  if (props.prop === 'updateTime') {
    return scope.row.updateTime
  }
  return scope.row[props.prop] || ''
}

// 判断是否需要显示提示框（内容不为空时才显示）
const shouldShowTooltip = (scope) => {
  const content = getContent(scope)
  return !!content && content.toString().length > 0
}
</script>

<style scoped>
.cell-content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
