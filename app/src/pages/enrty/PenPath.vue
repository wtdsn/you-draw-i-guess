<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { throttle, debounce } from 'utils-h'

onMounted(() => {
  window.addEventListener('resize', setSize as any)

  init()
  draw()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setSize as any)
})

// canvas 元素和 context 对象
const canvas = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D>()

// 初始化 canavs
function init() {
  ctx.value = canvas.value!.getContext('2d') as CanvasRenderingContext2D

  setSize()
}

// 设置宽高
let cw = ref(0), ch = ref(0)
let setSize = debounce(100, () => {
  let b = document.querySelector('body')!
  cw.value = b.offsetWidth
  ch.value = b.offsetHeight
  canvas.value!.width = cw.value
  canvas.value!.height = ch.value

  // 宽高修改后，一些样式需要重新设置
  ctx.value!.strokeStyle = '#0047ee'
  ctx.value!.lineWidth = 8
  ctx.value!.lineJoin = 'bevel'
}, false)



// 绘画
function draw() {
  requestAnimationFrame(() => {
    ctx.value!.clearRect(0, 0, cw.value, ch.value)
    paths.value = paths.value.filter((v) => v.draw())
    draw()
  })
}


//  Path 类
class Path {
  public opacity: number
  constructor(public x1: number, public y1: number, public x2: number, public y2: number) {
    this.opacity = 1
  }
  draw(): boolean {
    // delete
    if (this.opacity <= 0) {
      return false
    }
    let _ctx = ctx.value!

    // draw
    _ctx.beginPath()
    _ctx.moveTo(this.x1, this.y1)
    _ctx.lineTo(this.x2, this.y2)
    _ctx.globalAlpha = this.opacity
    this.opacity -= 0.01
    _ctx.closePath()
    _ctx.stroke()
    return true
  }
}
// path 集合
const paths = ref<Path[]>([])
// 之前的点
let prePath = ref<[number, number] | undefined>(undefined)
// 鼠标移动
let mousemove = throttle(20, (e: MouseEvent) => {
  let { pageX, pageY } = e
  if (!prePath.value) {
    prePath.value = [pageX, pageY]
  } else {
    let path = new Path(...prePath.value, pageX, pageY)
    prePath.value = [pageX, pageY]
    paths.value.push(path)
  }
}) as (e: MouseEvent) => void

</script>

<template>
  <canvas id="penPath" ref="canvas" @mousemove="mousemove"></canvas>
</template>

<style scoped lang="less">
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>