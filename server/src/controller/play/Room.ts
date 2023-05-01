import { statusE } from '@src/../../share/game'
import { Connect } from '@src/utils/socket-h'
import { throttle } from 'utils-h'

const words1 = ['草', '花', '鱼', '水']
const words2 = ['西瓜', '香蕉', '木鱼', '太阳']
const words3 = ['滑雪场', '含羞草', '拖拉机', '肯德基']
const words4 = ['蜜雪冰城', '后羿射日', '女娲补天', '嫦娥奔月']

// 等待时间
const showNewRounTime = 3000
export const chooseTime = 12000
const chooseDelay = 2000
export const drawTime = 90 * 1000
const roundEndTime = 3000
const gameEndTime = 3000

// 得分标准
const firtRight = 6
const secondRight = 4
const thirdRight = 3
const lastRight = 2

function computedDrawerScore(rightNum: number): number {
  // 规则
  // 按照答对一人给2分。总给分不操过 10 分。
  let score = rightNum * 2
  return score > 10 ? 10 : score
}


// 玩家接口声明
export interface palyerInter {
  uid: string,
  name: string,
  score: number,
  connect: Connect
}

// 接受的聊天信息
export interface chatInInter {
  name: string,
  msg: string,
  uid: string
}

// 发出的聊天信息
interface chatOutInter {
  type: "chat" | "right" // chat 即聊天或者错误答案 ， right  即正确答案
  name: string,
  msg: string,
  uid: string
}

// 作画信息
export interface drawInfoInter {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string
}

// 通知得分消息
interface scoreInfoInter {
  type: 'score',
  uid: string,
  addScore: number
}

// 回合类
class Round {
  public rightPalyer: Set<string> = new Set()
  public rightNum: number = 0
  public wordsList: string[] = []
  public keyword: string = ''
  public chooseTimer: any
  constructor(public drawerId: string) {
  }

  getWordsList() {
    this.wordsList = _getKeyWords()
    return this.wordsList
  }

  setKeyWord(word: string) {
    this.wordsList = []
    this.keyword = word
    clearTimeout(this.chooseTimer)
  }
}

function _getKeyWords() {
  let wordList = []
  wordList.push(words1[Math.round(Math.random() * words1.length)])
  wordList.push(words2[Math.round(Math.random() * words2.length)])
  wordList.push(words3[Math.round(Math.random() * words3.length)])
  wordList.push(words4[Math.round(Math.random() * words4.length)])
  return wordList
}


// 房间类
export class Room {
  public status: statusE
  public palyers: palyerInter[] = []
  public round: Round | undefined
  public drawerIndex = 0
  public roomOwnerId: string | undefined
  public roomOwnerName: string | undefined
  public chatList: chatOutInter[] = []
  public drawInfoList: drawInfoInter[] = []
  public drawTimer: any

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
    // 重置数据
    if (this.status === statusE.end) {
      this.drawerIndex = 0
      this.palyers.forEach(v => {
        v.score = 0
      })
    }

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
    this.round = undefined
    // 3000 显示新回合开始
    setTimeout(() => {
      this.noticeChoose()
    }, showNewRounTime)
  }

  // 通知前端发送请求
  noticeChoose() {
    this.noticeStatusChange(statusE.choosing)
    this.round = new Round(this.palyers[this.drawerIndex].uid)
    this.round.chooseTimer = setTimeout(() => {
      // 如果此时间内没有选择，默认选择第一个
      // todo 考虑其他异常情况呢？比如用户退出，本回合异常结束，进入下一个回合？
      this.setKeyWord(this.round?.wordsList[0]! || '花')
    }, chooseTime + chooseDelay)  // 2s 的延迟
  }

  // 选择完
  setKeyWord(word: string) {
    this.round!.setKeyWord(word)
    // 开始作画
    this.noticeStatusChange(statusE.drawing)
    this.drawTimer = setTimeout(() => {
      this.endRound()
    }, drawTime)
  }

  // 接收作画，发送作画
  noticeDraw(info: drawInfoInter) {
    this.drawInfoList.push(info)
    flushDrawInfoList(this.palyers, this.drawInfoList, this.drawerIndex)
  }


  endRound() {
    // 如果先全部答对
    clearTimeout(this.drawTimer)
    this.noticeStatusChange(statusE.roundEnd)
    this.drawerIndex++

    // 计算绘画者得分
    let addScore = computedDrawerScore(this.round!.rightNum)
    let palyer = this.palyers[this.drawerIndex]
    palyer.score += addScore

    let scoreInfo: scoreInfoInter = {
      type: "score",
      uid: palyer.uid,
      addScore: addScore
    }

    palyer.connect.send({
      code: 1,
      msg: "绘画者得分",
      data: scoreInfo
    })

    // 结算一波
    setTimeout(() => {
      // 目前仅考虑每人一回合
      if (this.drawerIndex === this.palyers.length) {
        // 结束游戏
        this.endGame()
        return
      }

      this.newRound()
    }, roundEndTime)
  }

  endGame() {
    this.noticeStatusChange(statusE.end)
    // 显示游戏结果
    setTimeout(() => {
      this.noticeStatusChange(statusE.waitingJoin)
    }, gameEndTime)
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
        // 刚答对
        this.chatList.push({
          type: "right",
          ...data,
          msg
        })
        this.round.rightNum++
        let addScore: number
        switch (this.round.rightNum) {
          case 1:
            addScore = firtRight
            break
          case 2:
            addScore = secondRight
            break
          case 3:
            addScore = thirdRight
            break
          default:
            addScore = lastRight
        }

        this.palyers.some(v => {
          if (v.uid === data.uid) {
            v.score += addScore
            return true
          }
          return false
        })

        this.round.rightPalyer.add(data.uid)

        // 特殊处理
        flushChatList(this.palyers, this.chatList, data.uid, addScore)


        if (this.round.rightNum === this.palyers.length) {
          // 全部答对
          this.endRound()
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

function flushChatList(palyers: palyerInter[], chatList: chatOutInter[], righterId?: string, addScore?: number) {
  let list = chatList.splice(0)

  if (righterId) {
    // 答对玩家
    let lastChat = chatList[chatList.length - 1]
    lastChat.msg = `答案:'${lastChat.msg}'正确！你是第一位答对的！+${addScore}`
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

    const scoreInfo: scoreInfoInter = {
      type: 'score',
      uid: righterId,
      addScore: addScore!
    }
    const scoreInfoStr = JSON.stringify({
      code: 1,
      msg: "得分更新",
      data: scoreInfo
    })
    palyers.forEach(v => {
      // 通知聊天
      if (v.uid === righterId) {
        v.connect.send(toWiner)
      } else
        v.connect.send(toOther)

      // 通知得分
      v.connect.send(scoreInfoStr)
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

let flushDrawInfoList = throttle(100, function (palyers: palyerInter[], infoLsit: drawInfoInter[], drawerIndex: number) {
  let data = JSON.stringify({
    code: 1,
    msg: "绘画更新",
    data: infoLsit.splice(0)
  })

  palyers.forEach((v, i) => {
    if (i !== drawerIndex) {
      v.connect.send(data)
    }
  })
}, true)

export const createRoomNumber: () => string = () => {
  let number = ''
  for (let i = 0; i < 6; i++) {
    number += Math.round(Math.random() * 9)
  }
  return number
}