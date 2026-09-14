<script setup lang="ts">
function onClick() {
  console.log('button clicked')
}
</script>

<template>
  <div class="demos">
    <DemoBox title="基础用法" description="type 控制按钮类型，默认 primary">
      <StButton>主要按钮</StButton>
      <StButton type="success">成功按钮</StButton>
      <StButton type="warning">警告按钮</StButton>
      <StButton type="danger">危险按钮</StButton>
      <StButton type="info">信息按钮</StButton>
      <StButton type="text">文字按钮</StButton>
    </DemoBox>

    <DemoBox title="不同尺寸" description="large / medium（默认）/ small">
      <StButton size="large">大型按钮</StButton>
      <StButton>中等按钮</StButton>
      <StButton size="small">小型按钮</StButton>
    </DemoBox>

    <DemoBox title="朴素与形状" description="plain 朴素按钮，round 圆角，circle 圆形">
      <StButton plain>朴素按钮</StButton>
      <StButton plain type="success">成功朴素</StButton>
      <StButton round>圆角按钮</StButton>
      <StButton circle title="搜索" icon="M21 21l-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0z" />
    </DemoBox>

    <DemoBox title="禁用与加载" description="disabled 禁用；loading 加载中（自动禁用）">
      <StButton disabled>禁用按钮</StButton>
      <StButton plain disabled>朴素禁用</StButton>
      <StButton loading>加载中</StButton>
      <StButton type="success" loading>提交中</StButton>
    </DemoBox>

    <DemoBox title="点击事件" description="监听 click 事件">
      <StButton @click="onClick">点击我</StButton>
    </DemoBox>
  </div>
</template>
