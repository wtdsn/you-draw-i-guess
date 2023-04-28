<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['clickTool'])
const tool = ref<'pen' | 'erase'>('pen')

// 定义为 readonly 的原始值数组，从而看可以使用值进行类型联合（而不是 string）
const colorList = <const>['#000', '#333', '#aaa', '#ff0000', '#f0f002', '#ffaa00', '#008000', '#0000ff', '#a19',]
const color = ref<typeof colorList[number]>('#333')

// 函数重载
interface clickToolsInter {
  (type: 'color', val: typeof colorList[number]): void
}
interface clickToolsInter {
  (type: 'tool', val: typeof tool.value): void
}

interface clickToolsInter {
  (type: 'clear', val?: undefined): void
}

let clickTools: clickToolsInter = function (type, val) {
  if (type === 'color') {
    color.value = val as typeof colorList[number]
    tool.value = 'pen'
  } else if (type === 'tool') {
    tool.value = val as typeof tool.value
  }
  emit('clickTool', type, val)
}
</script>

<template>
  <div class="draw_tools_con">
    <ul class="list">
      <li v-for="(v) in  colorList " :style="'background:' + v" class="color_item" @click="clickTools('color', v)">
      </li>
      <li :class="'tool pen iconfont icon-huabi_huaban1 ' + (tool === 'pen' ? 'active' : '')" title="画笔"
        :style="'color:' + color" @click="clickTools('tool', 'pen')">
      </li>
      <li :class="'tool  iconfont icon-rubber-full ' + (tool === 'pen' ? '' : 'active')" title="橡皮擦"
        @click="clickTools('tool', 'erase')"></li>
      <li class="tool clear iconfont icon-qingchu" title="清除画板" @click="clickTools('clear')"></li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.draw_tools_con {
  width: 100%;
  padding-right: 10px;
  color: #f0f002;

  .list {
    display: grid;
    height: 100%;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);

    grid-row-gap: 4px;
    grid-column-gap: 4px;

    li {
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid #888;
    }

    .tool {
      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 28px;
      border: 2px solid #ccc;
      color: #333;
    }

    .pen {
      text-shadow: 0 0 1px #000;
    }

    .tool.active {
      border-color: @themeColor;
    }

    .clear {
      &:hover {
        border-color: @themeColor;
      }

      &:active {
        background-color: #eee;
      }
    }
  }
}
</style>