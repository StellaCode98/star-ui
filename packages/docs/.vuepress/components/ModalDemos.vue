<script setup lang="ts">
import { ref } from 'vue'

const basic = ref(false)
const noMaskClose = ref(false)
const customFooter = ref(false)
const fullModal = ref(false)
</script>

<template>
  <div class="demos">
    <DemoBox title="基础用法" description="v-model 控制显隐">
      <StButton @click="basic = true">打开弹框</StButton>
      <StModal v-model="basic" title="基础弹框">
        <p>这是一个基础弹框，点击遮罩或右上角 × 可关闭。</p>
      </StModal>
    </DemoBox>

    <DemoBox title="不同尺寸" description="small / medium（默认）/ large / full">
      <StButton size="small" @click="noMaskClose = true">小型</StButton>
      <StButton @click="customFooter = true">中型</StButton>
      <StButton type="success" @click="full = true">全屏</StButton>
    </DemoBox>

    <DemoBox title="禁止遮罩关闭" description="mask-closable 设为 false 后只能通过按钮关闭">
      <StButton type="warning" @click="noMaskClose = true">禁止遮罩关闭</StButton>
    </DemoBox>

    <DemoBox title="自定义底部" description="使用 footer 插槽放置操作按钮">
      <StButton type="success" @click="customFooter = true">自定义底部</StButton>
    </DemoBox>

    <!-- 各弹框实例 -->
    <StModal v-model="noMaskClose" title="禁止遮罩关闭" size="small" :mask-closable="false">
      <p>点击遮罩不会关闭，请点击右下角按钮或右上角 × 关闭。</p>
      <template #footer="{ close }">
        <StButton size="small" @click="close()">取消</StButton>
        <StButton size="small" type="primary" @click="close()">确定</StButton>
      </template>
    </StModal>

    <StModal v-model="customFooter" title="确认操作" footer-align="right">
      <p>确定要删除这条记录吗？此操作不可恢复。</p>
      <template #footer="{ close }">
        <StButton @click="close()">取消</StButton>
        <StButton type="danger" @click="close()">删除</StButton>
      </template>
    </StModal>

    <StModal v-model="fullModal" title="全屏弹框" size="full">
      <p>全屏弹框适合展示大量内容，例如复杂表单或详细报表。</p>
      <p>内容区超出高度时会自动出现滚动条。</p>
    </StModal>
  </div>
</template>
