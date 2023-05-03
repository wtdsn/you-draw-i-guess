<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{
  time: number
}>()

// todo 清除上一个 timer
const leftTime = ref(props.time)
const con = ref<HTMLDivElement>()
const thumb = ref<HTMLDivElement>()
const preTime = ref<number>()
const stop = ref(false)
function computedWidth() {
  requestAnimationFrame(() => {
    const curTime = Date.now()
    leftTime.value -= (curTime - preTime.value!)
    preTime.value = curTime
    if (leftTime.value <= 0 || stop.value) {
      leftTime.value = 0
      thumb.value!.style.width = '0px'
    } else {
      thumb.value!.style.width = (leftTime.value) / (props.time) * con.value!.clientWidth + 'px'
      computedWidth()
    }
  })
}

watch(() => props.time, () => {
  // 清除上一个
  stop.value = true
  setTimeout(() => {
    stop.value = false
    leftTime.value = props.time
    preTime.value = Date.now()
    computedWidth()
  })
}, {
  immediate: true
})

</script>

<template>
  <div class="progress_con" ref="con">
    <div class="thumb" ref="thumb" style="width:0px"></div>
  </div>
</template>

<style scoped lang="less">
.progress_con {
  border: 2px solid #052f6e;
  background-color: #052f6e;
  border-radius: 10px;

  .thumb {
    height: 100%;
    border-radius: 10px;
    background-color: #f8c135;
  }
}
</style>