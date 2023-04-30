import { statusE } from '@src/../../share/game'
import { Connect } from '@src/utils/socket-h'
import { throttle } from 'utils-h'

const words1 = ['草', '花', '鱼', '水']
const words2 = ['西瓜', '香蕉', '木鱼', '太阳']
const words3 = ['滑雪场', '含羞草', '拖拉机', '肯德基']
const words4 = ['蜜雪冰城', '后羿射日', '女娲补天', '嫦娥奔月']

export interface palyerInter {
  uid: string,
  name: string,
  score: number,
  connect: Connect
}

class Round {
  constructor(public drawerId: string, public keyword: string) {
  }
}

export class Room {
  public status: statusE
  public palyers: palyerInter[] = []
  public round: Round | undefined
  public drawerIndex = 0
  public roomOwnerId: string | undefined
  public roomOwnerName: string | undefined
  public chatList: chatOutInter[] = []

  constructor(public roomNumber: string) {
    this.status = statusE.waitingJoin
  }

  // 有人加入
  joinRoom(palyer: palyerInter) {
    this.palyers.push(palyer)

    if (this.palyers.length === 0) {
      // 第一个进入的是房主
      this.roomOwnerId = palyer.uid
      this.roomOwnerName = palyer.name
      return
    }

    // 加入成功！
    palyer.connect.send({
      code: 1,
      msg: "加入成功！",
      data: {
        roomStatus: this.status,
        roomOwnerId: this.roomOwnerId,
        roomOwnerName: this.roomOwnerName,
        uid: palyer.uid
      }
    })

    // 通知人员更新
    this.noticeJoin()

    // 进入等待开始状态
    if (this.palyers.length > 1) this.noticeStatusChange(statusE.waitingStart)
  }

  // 通知有人加入
  noticeJoin() {
    let palyers = this.palyers
    let data = JSON.stringify({
      type: "join",
      msg: "新成员加入！",
      data: palyers.map(v => {
        return {
          uid: v.uid,
          name: v.name,
          score: v.score
        }
      })
    })

    palyers.forEach(v => {
      v.connect.send(data)
    })
  }

  // 状态改变
  noticeStatusChange(newStatus: statusE) {
    this.status = newStatus
    let data = JSON.stringify({
      type: 'status',
      msg: "房间状态变化",
      data: this.status
    })

    this.palyers.forEach(v => {
      v.connect.send(data)
    })
  }

  // 点击开始游戏
  startGame() {
    this.status = statusE.firstStart
  }

  // 选择中
  chooseList() {
    let wordList = []
    wordList.push(words1[Math.round(Math.random() * words1.length)])
    wordList.push(words2[Math.round(Math.random() * words2.length)])
    wordList.push(words3[Math.round(Math.random() * words3.length)])
    wordList.push(words4[Math.round(Math.random() * words4.length)])
    this.status = statusE.choosing
  }

  // 选择
  newTurn() {
    this.status === statusE.newRound
    setTimeout(() => {
      this.status === statusE.choosing
      this.chooseList()
      // this.round = new Round(this.drawerIndex)
    }, 3)
  }

  // 聊天
  chat(data: chatInInter) {
    // 绘画中
    if (this.status === statusE.drawing) {

    } else {
      this.chatList
    }

    // this.chatList.push(chatData)
    noticeChat(this.palyers, this.chatList)
  }
}

interface chatInInter {
  name: string,
  msg: string
}

interface chatOutInter {
  type: "chat" | "right"  // chat 即聊天或者错误答案 ， right  即正确答案
  name: string,
  msg: string
}

let noticeChat = throttle(300, function (palyers: palyerInter[], chatList: chatOutInter[]) {
  let data = JSON.stringify({
    type: 'chat',
    msg: "聊天更新",
    data: chatList
  })
  chatList.splice(0)

  palyers.forEach(v => {
    v.connect.send(data)
  })
}, true)

export const createRoomNumber: () => string = () => {
  let number = ''
  for (let i = 0; i < 6; i++) {
    number += Math.round(Math.random() * 9)
  }
  return number
}