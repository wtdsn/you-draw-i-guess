<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// 组件
import DrawBoard from './DrawBoard.vue';
import DrawTools from './DrawTools.vue';
import Dialog from './Dialog.vue'


// 声音是否开启
const openSound = ref(false)
function toggleSound() {
  openSound.value = !openSound.value
}


// 我的Id
const meId = ref(2)

// 绘画的人的 Id
const drawerId = ref(3)

interface playerInter {
  avatar: any,
  userName: string,
  score: number,
  id: number
}

// 获取资源
function getAvatarUrl(name: string) {
  return new URL('../../assets/img/avatar/' + name, import.meta.url).href
}

const palyers = ref<playerInter[]>([
  {
    avatar: getAvatarUrl('a1.png'),
    userName: "Jack",
    score: 0,
    id: 1
  },
  {
    avatar: getAvatarUrl('a2.png'),
    userName: "Mary",
    score: 0,
    id: 2
  },
  {
    avatar: getAvatarUrl('a3.png'),
    userName: "Tom",
    score: 0,
    id: 3
  },
  {
    avatar: getAvatarUrl('a4.png'),
    userName: "Wetson",
    score: 0,
    id: 4
  },
  {
    avatar: getAvatarUrl('a5.png'),
    userName: "Baryy",
    score: 0,
    id: 5
  },
  {
    avatar: getAvatarUrl('a6.png'),
    userName: "Furry",
    score: 0,
    id: 6
  },
  {
    avatar: getAvatarUrl('a7.png'),
    userName: "Kobe",
    score: 0,
    id: 7
  },
  {
    avatar: getAvatarUrl('a8.png'),
    userName: "Jam",
    score: 0,
    id: 8
  }
])

// 画板参数
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
    // clearf
    drawingBoard.value!.clear()
  }
}

// 离开
const router = useRouter()
function exitRoom() {
  if (confirm('离开')) {
    router.push('/entry')
  }
}

</script>

<template>
  <div class="play_con">
    <header class="head">
      <div class="return" @click="exitRoom">
        <img src="@/assets/img/index/rt.png" alt="">
      </div>

      <div class="sound" @click="toggleSound">
        <img src="@/assets/img/index/sy.png" v-if="openSound" alt="关闭声音">
        <img src="@/assets/img/index/jy.png" v-else alt="开启声音">
      </div>

      <div class="room_number">
        <span class="room_number">房间号：10123</span>
        <span class="room_owner">( 房主：Jack )</span>
      </div>
    </header>
    <main>
      <aside class="user_list_aside">
        <div class="scroll">
          <ul class="list">
            <li class="user_item" v-for="(v, i) in palyers">
              <div class="status">
                <img class="drawing" src="@/assets/img/index/paint.png" v-if="drawerId === v.id" />
                <div class="me" v-else-if="meId === v.id">Me</div>
                <div class="ind" v-else>{{ i + 1 }}</div>
              </div>
              <div class="avatar">
                <img :src="v.avatar" alt="">
              </div>
              <div class="info">
                <div class="name">{{ v.userName }}</div>
                <div class="score">{{ v.score }} 分</div>
              </div>
            </li>
          </ul>
        </div>
      </aside>
      <div class="right_part">
        <!-- 画板 -->
        <div class="drawing_board_con">
          <div class="board">
            <DrawBoard :color="color" :tool="tool" ref="drawingBoard" :status="drawerId === meId ? 'draw' : 'show'" />
            <Dialog />
          </div>
          <div class="progress">
            <div class="thumb"></div>
          </div>
        </div>
        <!-- 聊天区 -->
        <div class="answer_con">
          <DrawTools class="draw_tools_wrapper" @click-tool="handleClickTool" v-if="drawerId === meId" />
          <div class="answer_wrapper">
            <div class="chat_list_con">
              <div class="scroll">
                <ul class="chat_list">
                  <li class="chat_item">
                    <span class="user">User7899</span>
                    <span class="text">请问你是</span>
                  </li>

                  <li class="chat_item">
                    <span class="user">User7899</span>
                    <span class="text">请问你是</span>
                  </li>
                  <li class="chat_item">
                    <span class="user">User7899</span>
                    <span class="text">请问你是</span>
                  </li>
                  <li class="chat_item">
                    <span class="user">User7899</span>
                    <span class="text">请问你是</span>
                  </li>
                  <li class="chat_item">
                    <span class="user">User7899</span>
                    <span class="text">请问你是</span>
                  </li>
                  <li class="chat_item">
                    <span class="user">User7899</span>
                    <span class="text">请问你是</span>
                  </li>
                  <li class="chat_item">
                    <span class="user">User7899</span>
                    <span class="text">请问你是</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="send_con">
              <label for="inp">
                <img class="drawing" src="@/assets/img/index/hb2.png" />
              </label>
              <input id="inp" type="text" :disabled="drawerId === meId"
                :placeholder="drawerId === meId ? '你在作画中...' : '输入答案...'">
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
          border: 2px solid #052f6e;
          background-color: #052f6e;
          border-radius: 10px;

          .thumb {
            height: 100%;
            border-radius: 10px;
            background-color: #f8c135;
            width: 200px;
          }
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

            .user {
              color: #868d96;
              font-weight: bold;
              padding-right: 6px;
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