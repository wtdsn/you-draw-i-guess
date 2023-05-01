import { statusE } from '@src/../../share/game'
import { Connect } from '@src/utils/socket-h'
import { throttle } from 'utils-h'

const words1 = ['草', '花', '鱼', '水']
const words2 = ['西瓜', '香蕉', '木鱼', '太阳']
const words3 = ['滑雪场', '含羞草', '拖拉机', '肯德基']
const words4 = ['蜜雪冰城', '后羿射日', '女娲补天', '嫦娥奔月']

const showNewRounTime = 3000
const chooseTime = 12000
const drawTime = 90 * 1000
const roundEndTime = 3000

export interface palyerInter {
  uid: string,
  name: string,
  score: number,
  connect: Connect
}

export interface chatInInter {
  name: string,
  msg: string,
  uid: string
}

interface chatOutInter {
  type: "chat" | "right"  // chat 即聊天或者错误答案 ， right  即正确答案
  name: string,
  msg: string,
  uid: string
}


// public keyword: string
class Round {
  public rightPalyer: Set<string> = new Set()
  public keyword: string = ''
  constructor(public drawerId: string, public noRightNum: number) {
  }

  choose() {
    let wordList = []
    wordList.push(words1[Math.round(Math.random() * words1.length)])
    wordList.push(words2[Math.round(Math.random() * words2.length)])
    wordList.push(words3[Math.round(Math.random() * words3.length)])
    wordList.push(words4[Math.round(Math.random() * words4.length)])
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
    let data: string
    if (newStatus > 1) {
      // 开始后
      data = JSON.stringify({
        type: 'status',
        msg: "房间状态变化",
        data: {
          status: newStatus,
          roomOwnerId: this.roomOwnerId,
          roomOwnerName: this.roomOwnerName,
          drawerId: this.palyers[this.drawerIndex].uid
        }
      })
    } else {
      // 还没开始
      data = JSON.stringify({
        type: 'status',
        msg: "房间状态变化",
        data: {
          status: newStatus
        }
      })
    }


    this.palyers.forEach(v => {
      v.connect.send(data)
    })
  }

  // 点击开始游戏
  startGame() {
    if (this.status === statusE.waitingStart) {
      this.newRound()
      return true
    }
    else {
      return false
    }
  }

  // 选择
  newRound() {
    this.noticeStatusChange(statusE.newRound)
    // 3000 显示新回合开始
    setTimeout(() => {
      this.noticeStatusChange(statusE.choosing)
      this.round = new Round(this.palyers[this.drawerIndex].uid, this.palyers.length)
    }, showNewRounTime)
  }

  endRound() {
    this.noticeStatusChange(statusE.roundEnd)
    this.drawerIndex++
    if (this.drawerIndex === this.palyers.length) {
      // 结束游戏
      setTimeout(() => {

      },)
    }
    setTimeout(() => {

    })
  }

  // 聊天
  chat(data: chatInInter) {
    // 绘画中
    let msg = data.msg.trim()

    // 答对了
    if (this.status === statusE.drawing && msg === this.round?.keyword) {
      // 如果之前就答对
      if (this.round.rightPalyer.has(data.uid)) {
        this.chatList.push({
          type: "chat",
          ...data,
          msg: "*".repeat(this.round.keyword.length)
        })
      } else {
        this.chatList.push({
          type: "right",
          ...data,
          msg
        })
        this.round.noRightNum--
        this.round.rightPalyer.add(data.uid)

        // 特殊处理
        flushChatList(this.palyers, this.chatList, data.uid)


        // todo 全部答对
        if (!this.round.noRightNum) {
          // 全部答对
          console.log("全部答对");

        }
        return
      }
    }
    else {
      // 没有答对或者非答题
      this.chatList.push({
        type: "chat",
        ...data
      })
    }

    noticeChat(this.palyers, this.chatList)
  }
}


let noticeChat = throttle(300, flushChatList, true)

function flushChatList(palyers: palyerInter[], chatList: chatOutInter[], righterId?: string) {
  let list = chatList.splice(0)

  if (righterId) {
    // 答对玩家
    let lastChat = chatList[chatList.length - 1]
    lastChat.msg = `答案:'${lastChat.msg}'正确！你是第一位答对的！+6`
    let toWiner = JSON.stringify({
      type: 'chat',
      msg: "聊天更新",
      data: list
    })
    lastChat.msg = `玩家${lastChat.name}回答正确!是第一位答对的玩家`
    let toOther = JSON.stringify({
      type: 'chat',
      msg: "聊天更新",
      data: list
    })

    palyers.forEach(v => {
      if (v.uid === righterId) {
        v.connect.send(toWiner)
      } else
        v.connect.send(toOther)
    })
  } else {
    // 正常
    let data = JSON.stringify({
      type: 'chat',
      msg: "聊天更新",
      data: list
    })

    palyers.forEach(v => {
      v.connect.send(data)
    })
  }
}

export const createRoomNumber: () => string = () => {
  let number = ''
  for (let i = 0; i < 6; i++) {
    number += Math.round(Math.random() * 9)
  }
  return number
}