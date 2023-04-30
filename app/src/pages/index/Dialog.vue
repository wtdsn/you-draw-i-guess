<script setup lang="ts">
// todo 邀请用户
import { ref } from 'vue'
import { statusE } from '@/../../../share/game'

// 需要用户 id , 绘画的 id , 房主 id
const ownerId = ref(2)
const drawerId = ref(3)
const meId = ref(1)
const drawerName = ref('Jack')

const status = ref<statusE>(2)

</script>
<template>
  <div :class="'dialog_con ' + (status === statusE.drawing && drawerId === meId ? 'show_keyword' : '')">
    <div class="un_start" v-if="status < 2">
      <!-- 等待玩家加入 -->
      <div class="text" v-if="status === statusE.waitingJoin">等待玩家加入</div>

      <!-- 房主确认开始 -->
      <div class="comfirm_start" v-else-if="meId === ownerId">
        <button>开始游戏</button>
      </div>

      <!-- 玩家等待房主开始 -->
      <div class="text" v-else>等待房主开始游戏</div>
    </div>

    <!-- 我绘画时 显示给我看的 -->
    <div class="drawing" v-else-if="drawerId === meId">
      <!-- 你的回合 -->
      <div class="text" v-if="status === statusE.newRound">新回合开始！到你作画了！</div>

      <!-- 选择词语 提供词语和跳过按钮 （10s）后默认跳过-->
      <div class="" v-else-if="status === statusE.choosing">
        请选择绘画词语
      </div>
      <!-- 你的选择是：请作画 （90s 内作画）-->
      <div class="choose_text" v-else-if="status === statusE.drawing">
        走马观花
      </div>
      <!-- 您跳过此回合！进入下一个回合中 -->
      <div class="text" v-else>
        您跳过此回合！将进入下一个回合
      </div>
    </div>

    <!-- 别人绘画时，我看的 -->
    <div class="showing" v-else>
      <!-- 新回合，谁绘画 -->
      <div class="text" v-if="status === statusE.newRound">新回合开始！玩家{{ drawerName }}开始作画</div>
      <!-- 选择词语中 -->
      <div class="text" v-else-if="status === statusE.choosing">
        选择词语中
      </div>
      <!-- 该玩家跳过此回合，进入下一个回合中 -->
      <div class="text" v-else-if="status === statusE.skipRound">
        玩家{{ drawerName }}跳过此回合！将进入下一个回合
      </div>
    </div>

  </div>
</template>

<style scoped lang="less">
.dialog_con {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  .un_start,
  .drawing,
  .showing {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  .text {
    font-size: 24px;
    font-weight: 600;
    color: @themeColor;
  }
}

.show_keyword {
  height: auto;
  width: 200px;
}
</style>