<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumn } from '@star-ui/components'

interface User {
  id: number
  name: string
  age: number
  city: string
  status: 'online' | 'offline'
}

const columns: TableColumn<User>[] = [
  { key: 'id', title: 'ID', width: 80, align: 'center' },
  { key: 'name', title: '姓名', minWidth: 120 },
  { key: 'age', title: '年龄', width: 100, align: 'right' },
  { key: 'city', title: '城市', minWidth: 120 },
  { key: 'status', title: '状态', width: 110, align: 'center' },
]

const data: User[] = [
  { id: 1, name: '张伟', age: 28, city: '北京', status: 'online' },
  { id: 2, name: '李娜', age: 34, city: '上海', status: 'offline' },
  { id: 3, name: '王强', age: 25, city: '深圳', status: 'online' },
  { id: 4, name: '刘洋', age: 41, city: '杭州', status: 'offline' },
  { id: 5, name: '陈静', age: 30, city: '成都', status: 'online' },
]

const borderedColumns: TableColumn<User>[] = [
  ...columns.slice(0, 4),
  { key: 'status', title: '状态', width: 110, align: 'center', format: (row) => (row.status === 'online' ? '在线' : '离线') },
]

const loading = ref(false)

function toggleLoading() {
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}
</script>

<template>
  <div class="demos">
    <DemoBox title="基础用法" description="columns 配置列，data 提供数据">
      <div class="block">
        <StTable :columns="columns" :data="data">
          <template #default="{ row }">
            <span
              class="status-dot"
              :class="row.status === 'online' ? 'is-online' : 'is-offline'"
            >{{ row.status === 'online' ? '在线' : '离线' }}</span>
          </template>
        </StTable>
      </div>
    </DemoBox>

    <DemoBox title="斑马纹与边框" description="stripe 斑马纹；border 显示全边框；format 格式化单元格">
      <div class="block">
        <StTable :columns="borderedColumns" :data="data" stripe border />
      </div>
    </DemoBox>

    <DemoBox title="加载与空数据" description="loading 显示加载遮罩；空数据展示 empty 插槽/文案">
      <div class="block">
        <p>
          <StButton size="small" :loading="loading" @click="toggleLoading">模拟加载 2 秒</StButton>
        </p>
        <StTable :columns="columns" :data="data" :loading="loading" />
        <StTable :columns="columns" :data="[]" empty-text="这里还没有任何数据" />
      </div>
    </DemoBox>
  </div>
</template>

<style scoped>
.block {
  width: 100%;
}

.status-dot {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.status-dot::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.status-dot.is-online {
  color: #16a34a;
}

.status-dot.is-offline {
  color: #9ca3af;
}
</style>
