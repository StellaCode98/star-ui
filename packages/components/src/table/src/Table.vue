<script setup lang="ts" generic="Row extends object">
import { computed } from 'vue'
import type { PropType } from 'vue'
import { tableProps } from './props'
import type { TableColumn } from './props'
import '../../../styles/table.css'

const props = defineProps({
  ...tableProps,
  data: { type: Array as PropType<Row[]>, default: () => [] },
  columns: { type: Array as PropType<TableColumn<Row>[]>, default: () => [] },
})

const emit = defineEmits<{
  (e: 'row-click', row: Row, index: number, evt: MouseEvent): void
  (e: 'cell-click', row: Row, column: TableColumn<Row>, index: number, evt: MouseEvent): void
}>()

const isEmpty = computed(() => props.data.length === 0)

function cellValue(row: Row, col: TableColumn<Row>, index: number): string {
  if (col.format) return String(col.format(row, index))
  return row[col.key as keyof Row] == null ? '' : String(row[col.key as keyof Row])
}

function getRowKey(row: Row, index: number): string | number {
  const v = row[props.rowKey as keyof Row]
  return v == null ? index : (v as string | number)
}

function onRowClick(row: Row, index: number, evt: MouseEvent) {
  emit('row-click', row, index, evt)
}

function onCellClick(row: Row, col: TableColumn<Row>, index: number, evt: MouseEvent) {
  emit('cell-click', row, col, index, evt)
}
</script>

<template>
  <div class="st-table" :class="{ 'is-bordered': border }">
    <div v-if="loading" class="st-table__loading" role="status" aria-live="polite">
      <svg class="st-table__spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="42 15" />
      </svg>
      <span>加载中…</span>
    </div>
    <div class="st-table__scroll">
      <table class="st-table__inner">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width, minWidth: col.minWidth, textAlign: col.align }"
              scope="col"
            >
              {{ col.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in data"
            :key="getRowKey(row, index)"
            :class="{ 'is-striped': stripe && index % 2 === 1 }"
            @click="onRowClick(row, index, $event)"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              @click="onCellClick(row, col, index, $event)"
            >
              <slot :column="col" :row="row" :index="index">
                {{ cellValue(row, col, index) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isEmpty && !loading" class="st-table__empty">
        <slot name="empty">{{ emptyText }}</slot>
      </div>
    </div>
  </div>
</template>
