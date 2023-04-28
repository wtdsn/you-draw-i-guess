<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="continer">
    <RouterView></RouterView>
  </div>
</template>

<style scoped lang="less">
.continer {
  height: 100vh;
  background-color: @themeColor;
 
  background-image: url('@/assets/img/bg/bg.png');
  background-size: 280px;
}
</style>