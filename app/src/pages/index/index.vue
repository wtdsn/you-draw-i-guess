<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getAvatarUrl } from '@/utils/index'
import { statusE } from '../../../../share/game';
import { drawInfoInter } from './DrawBoard.vue';

// 组件
import DrawBoard from './DrawBoard.vue';
import DrawTools from './DrawTools.vue';
import Dialog from './Dialog.vue'
import Progress from './Progress.vue'
import { throttle, debounce } from 'utils-h';

const router = useRouter()

/* 
   初始化房间数据和我的名称
*/
const { query: { name, roomNumber } } = useRoute()
if (!name || !roomNumber) {
  confirm("参数错误")
  router.replace({
    name: "enrty"
  })
}

// 声音是否开启
const openSound = ref(false)
function toggleSound() {
  openSound.value = !openSound.value
}

// 离开
function exitRoom() {
  if (confirm('离开')) {
    router.push('/entry')
  }
}



/* 
   玩家队列相关
*/
interface playerInter {
  avatar: any,
  name: string,
  score: number,
  uid: string
}
const palyers = ref<playerInter[]>([])

// 更新队列
function updatePlayers(player: any) {
  palyers.value = player.map((v: any, i: number) => {
    return {
      ...v,
      // 路径相对 utils 文件 ,注意打包后的路径
      avatar: getAvatarUrl('../assets/img/avatar/', `a${i + 1}.png`)
    } as playerInter
  })
}

// 更新排名
function sortPlayers(data: any) {
  const { uid, addScore } = data
  let index: number = 0

  palyers.value.some((v, i) => {
    if (v.uid === uid) {
      v.score += addScore
      index = i - 1
      return true
    }
  })
  if (index >= 0) {
    let p = palyers.value.splice(index, 1)[0]
    while (index >= 0 && palyers.value[index].score < p.score) {
      index--
    }
    palyers.value.splice(index + 1, 0, p)
  }
}


// 房间参数
const myId = ref('')
const drawerId = ref('')
const status = ref<statusE>(0)
const ownerId = ref<string>('')
// 计算值
const ownerName = computed(() => {
  let name: string = ''
  palyers.value.some(v => {
    if (v.uid === ownerId.value) {
      name = v.name
      return true
    }
  })
  return name
})
const drawerName = computed(() => {
  let name: string = ''
  palyers.value.some(v => {
    if (v.uid === drawerId.value) {
      name = v.name
      return true
    }
  })
  return name
})


// 初始化房间参数
interface myJoinResIn {
  status: statusE,
  roomOwnerId: string,
  myId: string
}

function initRoomInfo(data: myJoinResIn) {
  console.log("加入成功！", data);
  myId.value = data.myId
  ownerId.value = data.roomOwnerId
  status.value = data.status
}

function updateRoomStatus(data: any) {
  // 原本是 end ，重新开始
  if (status.value === statusE.end) {
    palyers.value.forEach(v => {
      v.score = 0
    })
  }

  status.value = data.status
  ownerId.value = data.roomOwnerId
  if (data.status < 2) {
    drawerId.value = ''
    time.value = 0
    return
  }
  drawingBoard?.value?.clear()
  time.value = data.waitTime
  drawerId.value = data.drawerId
}

/* 
   加入房间
*/
function joinRoom() {
  sendWs({
    type: "join",
    data: {
      name,
      roomNumber
    }
  })
}

/* 
   聊天相关
*/
interface chatInfoIn {
  type: "chat" | "right" // chat 即聊天或者错误答案 ， right  即正确答案
  name: string,
  msg: string,
  uid: string
}

const chatList = ref<chatInfoIn[]>([])

// 更新聊天
function updateChatList(chatInfos: chatInfoIn[]) {
  chatList.value.push(...chatInfos)
  scroll()
}

const chatValue = ref('')

// 发布聊天
function sendChat() {
  if (!chatValue.value || !myId.value) {
    return
  }

  sendWs({
    type: "chat",
    data: {
      name,
      msg: chatValue.value,
      uid: myId.value
    }
  })
  chatValue.value = ''
}

/* 
   画板参数,画板相关操作
*/
const color = ref<string>('#333')
const tool = ref<'pen' | 'erase'>('pen')
const drawingBoard = ref<typeof DrawBoard>()

function handleClickTool(type: "tool" | 'clear' | 'color', val?: string) {
  if (type === 'color') {
    tool.value = 'pen'
    color.value = val!
  } else if (type === 'tool') {
    tool.value = val as typeof tool.value
  } else {
    drawingBoard.value!.clear()
    sendDrawInfo({
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
      color: '',
      tool: "clear"
    })
  }
}


/* 
   绘画相关
*/
const drawInfoList = ref<drawInfoInter[]>([])
function sendDrawInfo(drawInfo: drawInfoInter) {
  drawInfoList.value.push(drawInfo)
  _sendDrawInfo()
}

let _sendDrawInfo = throttle(100, () => {
  sendWs({
    type: 'draw',
    data: drawInfoList.value.splice(0)
  })
}, true)


function getDrawInfo(drawInfos: drawInfoInter[]) {
  drawInfos.forEach(v => {
    drawingBoard!.value!.draw(v)
  })
}


/* 
     Dialog 操作
*/
const time = ref<number>(0)
const keyWord = ref<string>('')
const keyWordList = ref<string[]>([])
function startGame() {
  sendWs({
    type: 'start'
  })
}

function chooseKeyWord(word: string) {
  keyWord.value = word
  sendWs({
    type: "choose",
    data: word
  })
}

interface showKeyWordResIn {
  time: number,
  list: string[]
}
function showKeyWordList(data: showKeyWordResIn) {
  keyWord.value = ''
  keyWordList.value = data.list
}

/* 
   创建 ws 连接
*/
interface msgIn<T = any> {
  code: 0 | 1,
  msg: string,
  data: {
    type: 'join' | 'myJoin' | 'chat' | 'draw' | 'status' | 'choosing' | "score",
    data: T
  }
}

let ws: WebSocket
onMounted(() => {
  ws = new WebSocket('ws:localhost:9528/game')
  ws.addEventListener('open', () => {
    joinRoom()
  })

  ws.addEventListener('message', (v) => {
    let { code, data } = JSON.parse(v.data) as msgIn
    if (!code) return

    console.log("msgin", data);

    switch (data.type) {
      case 'chat':
        updateChatList(data.data)
        break
      case 'draw':
        getDrawInfo(data.data)
        break
      case 'status':
        updateRoomStatus(data.data)
        break
      case 'choosing':
        showKeyWordList(data.data)
        break
      case 'score':
        sortPlayers(data.data)
        break
      case 'join':
        updatePlayers(data.data)
        break
      case 'myJoin':
        initRoomInfo(data.data)
        break
    }
  })

  ws.addEventListener('close', (v) => {
    console.log("close", v);
  })
})

function sendWs(data: any) {
  ws.send(JSON.stringify(data))
}

onUnmounted(() => {
  ws && ws.close()
})

// 滚动
let scroll = debounce(100, () => {
  const scrollEl = document.querySelector('#chatScroll') as HTMLElement
  scrollEl.scrollTo({
    top: scrollEl.scrollHeight - scrollEl.clientHeight,
    left: 0,
    behavior: 'smooth'
  })
}, false)

</script>

<template>
  <div class="play_con">
    <!-- 顶部 -->
    <header class="head">
      <div class="return" @click="exitRoom">
        <img src="@/assets/img/index/rt.png" alt="">
      </div>

      <div class="sound" @click="toggleSound">
        <img src="@/assets/img/index/sy.png" v-if="openSound" alt="关闭声音">
        <img src="@/assets/img/index/jy.png" v-else alt="开启声音">
      </div>

      <div class="room_number">
        <span class="room_number">房间号：{{ roomNumber }}</span>
        <span class="room_owner">( 房主：{{ ownerName }} )</span>
      </div>
    </header>
    <main>
      <!-- 玩家列表 -->
      <aside class="user_list_aside">
        <div class="scroll" v-if="palyers.length">
          <ul class="list">
            <li class="user_item" v-for="(v, i) in palyers">
              <div class="status">
                <img class="drawing" src="@/assets/img/index/paint.png" v-if="drawerId === v.uid" />
                <div class="me" v-else-if="myId === v.uid">Me</div>
                <div class="ind" v-else>{{ i + 1 }}</div>
              </div>
              <div class="avatar">
                <img :src="v.avatar" alt="">
              </div>
              <div class="info">
                <div class="name">{{ v.name }}</div>
                <div class="score">{{ v.score }} 分</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="loading_players" v-else>loading...</div>
      </aside>
      <!-- 画板-聊天 -->
      <div class="right_part">
        <!-- 画板 -->
        <div class="drawing_board_con">
          <!--  -->
          <div class="board">
            <DrawBoard :color="color" :tool="tool" ref="drawingBoard" :status="drawerId === myId ? 'draw' : 'show'"
              :sendDrawInfo="sendDrawInfo" />
            <Dialog @start-game="startGame" @choose-key-word="chooseKeyWord" :status="status" :drawer-id="drawerId"
              :my-id="myId" :owner-id="ownerId" :drawer-name="drawerName" :key-word-list="keyWordList"
              :key-word="keyWord" />
          </div>
          <!-- 时间进度 -->
          <Progress v-if="time" :time="time" class="progress" />
        </div>
        <!-- 聊天区 -->
        <div class="answer_con">
          <DrawTools class="draw_tools_wrapper" @click-tool="handleClickTool" v-if="drawerId && drawerId === myId" />
          <div class="answer_wrapper">
            <div class="chat_list_con">
              <div class="scroll" id="chatScroll">
                <ul class="chat_list">
                  <li class="chat_item" v-for="(v) in chatList">
                    <template v-if="v.type === 'chat'">
                      <span class="user">{{ v.name }}</span>
                      <span class="text">{{ v.msg }}</span>
                    </template>
                    <template v-else>
                      <span class="right">{{ v.msg }}</span>
                    </template>
                  </li>
                </ul>
              </div>
            </div>
            <div class="send_con">
              <label for="inp">
                <img class="drawing" src="@/assets/img/index/hb2.png" />
              </label>
              <input id="inp" type="text" :disabled="(!!drawerId && drawerId === myId)"
                :placeholder="(drawerId && drawerId === myId) ? '你在作画中...' : '输入答案...'" v-model.trim="chatValue"
                @keyup.enter="sendChat">
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="less">
.play_con {
  height: 100vh;
  overflow: hidden;
  padding: 20px 40px;
  box-sizing: border-box;

  .head {
    height: 60px;

    img {
      width: 40px;
      margin: 10px 0;
      cursor: pointer;
      transition: 0.1s;

      &:hover {
        transform: scale(1.1);
      }
    }

    .return {
      float: left;
    }

    .sound {
      float: right;
    }

    .room_number {
      text-align: center;
      margin: 0 auto;
      color: #fff;
      line-height: 60px;
      font-size: 24px;
    }

    .room_owner {
      font-size: 22px;
      padding-left: 20px;
      color: #e9e8e8;
    }
  }

  main {
    margin-top: 14px;
    height: calc(100vh - 114px);

    display: flex;

    .user_list_aside {
      width: 300px;
      padding: 6px;
      box-sizing: border-box;
      background-color: #fff;
      margin-right: 20px;
      border-radius: 10px;

      .loading_players {
        text-align: center;
        margin-top: 20px;
        color: #444;
        font-size: 20px;
      }


      .user_item {
        height: 86px;
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        display: flex;

        .status {
          width: 40px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: 30px;
          }

          .me,
          .ind {
            color: @themeColor;
            font-weight: 600;
          }

          .ind {
            font-size: 20px;
          }
        }

        .avatar {
          width: 70px;

          img {
            width: 70px;
            margin-top: 8px;
          }
        }

        .info {
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          .name {
            font-size: 22px;
            color: #555;
          }

          .score {
            font-weight: 600;
            color: #444;
            font-size: 18px;
          }
        }
      }

      .user_item:last-child {
        border-bottom: none;
      }
    }

    .right_part {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;


      .drawing_board_con {
        flex: 1;
        background-color: #fff;
        border-radius: 10px;

        padding: 14px 20px;

        display: flex;
        flex-direction: column;

        .board {
          position: relative;
          flex: 1;
        }

        .progress {
          margin-top: 8px;
          height: 8px;
        }
      }

      .answer_con {
        height: 172px;
        padding: 14px 20px;
        margin-top: 20px;
        background-color: #fff;
        border-radius: 10px;

        display: flex;

        .draw_tools_wrapper {
          width: 140px;
          border-right: 1px solid #e4e4e4;
          margin-right: 20px;
        }

        .answer_wrapper {
          flex: 1;

        }

        .chat_list_con {
          height: 120px;
          padding: 6px 0;

          .chat_item {
            padding: 3px 0;
            font-size: 16px;
            color: #8b929b;

            .user,
            .right {
              color: #868d96;
              font-weight: bold;
              padding-right: 6px;
            }

            .right {
              color: @themeColor;
            }
          }
        }

        .send_con {
          border: 1px solid #666;
          height: 36px;
          border: 2px solid #868d96;
          border-radius: 8px;
          display: flex;
          align-items: center;

          label {
            width: 30px;
            height: 26px;
            padding: 0 4px;

            img {
              width: 26px;
            }
          }

          input {
            height: 32px;
            flex: 1;
            font-size: 16px;
            background-color: transparent;
          }

        }


      }
    }

    .scroll {
      height: 100%;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        width: 6px;
        background-color: #aaa;
        border-radius: 4px;
      }
    }
  }
}
</style>