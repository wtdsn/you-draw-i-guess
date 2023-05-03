<script setup lang="ts">
// todo 邀请用户
import { toRefs, defineEmits } from 'vue'
import { statusE } from '../../../../share/game.ts'

// 用户 id , 绘画的 id , 房主 id , 房间状态
interface propsIn {
  status: statusE
  ownerId: string
  drawerId: string
  drawerName: string
  myId: string,
  keyWordList: string[],
  keyWord: string
}
const props = defineProps<propsIn>()
const { status, myId, drawerId, ownerId, drawerName, keyWordList, keyWord } = toRefs(props)
// const status = 3
// const myId = 1
// const drawerId = 1
// const ownerId = 3
// const drawerName = "jack"
// const keyWord = '走马观花'
// const keyWordList = ['花', '小草', '123', '1234']

const emite = defineEmits(['startGame', 'chooseKeyWord'])
function startGame() {
  emite('startGame')
}

function chooseKeyWord(word: string) {
  emite('chooseKeyWord', word)
}

</script>
<template>
  <div :class="'dialog_con ' + (status === statusE.drawing && drawerId === myId ? 'show_keyword' : '')">
    <!-- 未开始 -->
    <div class="un_start" v-if="status < 2">
      <!-- 等待玩家加入 -->
      <div class="text" v-if="status === statusE.waitingJoin">等待玩家加入</div>

      <!-- 房主确认开始 -->
      <div class="comfirm_start" v-else-if="myId === ownerId">
        <button @click="startGame">开始游戏</button>
      </div>

      <!-- 玩家等待房主开始 -->
      <div class="text" v-else>等待房主开始游戏</div>
    </div>
    <!-- 结束 -->
    <div class="end" v-else-if="status === statusE.end">
      <div class="end_text">游戏结束</div>
      <div class="show_to_room_owner" v-if="myId === ownerId">
        <button @click="startGame">再来一局</button>
      </div>
    </div>
    <!-- 我绘画时 显示给我看的 -->
    <div class="drawing" v-else-if="drawerId === myId">
      <!-- 你的回合 -->
      <div class="text" v-if="status === statusE.newRound">新回合开始！到你作画了！</div>

      <!-- 选择词语 提供词语和跳过按钮 （10s）后默认跳过-->
      <div class="choosing" v-else-if="status === statusE.choosing">
        <div class="title">
          请选择绘画词语
        </div>
        <div class="chooseList">
          <button class="word" v-for="(v, i) in keyWordList" :key="i" @click="chooseKeyWord(v)">{{ v }}</button>
        </div>
      </div>
      <!-- 你的选择是：请作画 （90s 内作画）-->
      <div class="choose_text" v-else-if="status === statusE.drawing">
        {{ keyWord || keyWordList[0] }}
      </div>
      <!-- 、回合结束 -->
      <div class="text" v-else-if="status === statusE.roundEnd">
        此回合结束！
      </div>
    </div>

    <!-- 别人绘画时，我看的 -->
    <div class="showing" v-else>
      <!-- 新回合，谁绘画 -->
      <div class="text" v-if="status === statusE.newRound">新回合开始！玩家{{ drawerName }}开始作画</div>
      <!-- 选择词语中 -->
      <div class="text" v-else-if="status === statusE.choosing">
        选择词语中...
      </div>
      <!-- 该玩家跳过此回合，进入下一个回合中 -->
      <div class="text" v-else-if="status === statusE.roundEnd">
        此回合结束！
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
  .end,
  .showing {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .choosing {
    .title {
      text-align: center;
      font-size: 18px;
      margin-bottom: 30px;
    }

    .chooseList {
      display: flex;

      .word {
        color: @themeColor;
        padding: 10px;
        margin: 0 10px;
        font-size: 18px;
        text-decoration: underline;
        cursor: pointer;

        &:hover {
          font-weight: bold;
        }
      }
    }
  }


  .text {
    font-size: 24px;
    font-weight: 600;
    color: @themeColor;
  }
}

.end_text {
  font-size: 20px;
  margin-bottom: 30px;
}

.comfirm_start,
.show_to_room_owner {
  button {
    color: @themeColor;
    font-size: 20px;
    cursor: pointer;
    padding: 6px 20px;
    border-radius: 20px;
    border: 1px solid @themeColor;
  }
}

.show_keyword {
  height: auto;
  text-align: left;
  width: fit-content;
}
</style>