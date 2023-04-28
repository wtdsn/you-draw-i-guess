<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { throttle, debounce } from 'utils-h'

interface propT {
  color: string,
  tool: 'pen' | 'erase',
  status: 'draw' | "show"
}
const props = defineProps<propT>()

onMounted(() => {
  window.addEventListener('resize', setSize as any)
  window.addEventListener('mouseup', leave)
  init()
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setSize as any)
  window.removeEventListener('mouseup', leave)
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
let cw = ref(0), ch = ref(0), ox = ref(0), oy = ref(0)
let setSize = debounce(100, () => {
  let b = document.querySelector('.drawing_canvas_con') as HTMLDivElement
  let { width, height, x, y } = b.getBoundingClientRect()

  cw.value = width
  ch.value = height
  ox.value = x
  oy.value = y
  canvas.value!.width = cw.value
  canvas.value!.height = ch.value

  // 宽高修改后，一些样式需要重新设置
  ctx.value!.lineWidth = 2
}, false)

//  Path 类
class Path {
  constructor(public x1: number, public y1: number, public x2: number, public y2: number,
    public type: 'pen' | "erase", public color: string,
  ) { }
  draw() {
    let _ctx = ctx.value!

    // draw
    _ctx.beginPath()
    _ctx.moveTo(this.x1, this.y1)
    _ctx.lineTo(this.x2, this.y2)
    _ctx.lineWidth = this.type === 'erase' ? 10 : 2
    _ctx.strokeStyle = this.type === 'erase' ? "#fff" : this.color
    _ctx.closePath()
    _ctx.stroke()
  }
}

// 之前的点
let prePosi = ref<[number, number] | undefined>(undefined)
let startDraw = ref(false)
// 鼠标移动
let mousemove = throttle(20, (e: MouseEvent) => {
  if (!startDraw.value) return
  let { pageX, pageY } = e
  pageX -= ox.value
  pageY -= oy.value

  let path = new Path(...prePosi.value!, pageX, pageY, props.tool, props.color)
  prePosi.value = [pageX, pageY]
  path.draw()
}) as (e: MouseEvent) => void

function start(e: MouseEvent) {
  if (props.status === 'show') return
  startDraw.value = true
  let { pageX, pageY } = e
  pageX -= ox.value
  pageY -= oy.value
  prePosi.value = [pageX, pageY]
}

function leave() {
  startDraw.value = false
}

// 暴露 clear 方法
function clear() {
  ctx.value!.clearRect(0, 0, cw.value, ch.value)
}

defineExpose({
  clear
})
</script>

<template>
  <div class="drawing_canvas_con">
    <canvas id="penPath" ref="canvas" @mousemove="mousemove" @mousedown="start"></canvas>
  </div>
</template>

<style scoped lang="less">
.drawing_canvas_con {
  width: 100%;
  height: 100%;
}

canvas {
  display: block;
}
</style>