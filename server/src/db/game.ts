import { statusE } from '@src/../../share/game'


const words1 = ['草', '花', '鱼', '水']
const words2 = ['西瓜', '香蕉', '木鱼', '太阳']
const words3 = ['滑雪场', '含羞草', '拖拉机', '肯德基']
const words4 = ['蜜雪冰城', '后羿射日', '女娲补天', '嫦娥奔月']

interface palyerInter {
  uid: string,
  name: string,
  score: number,
  server: any
}

class Round {
  constructor(public drawerId: string, public keyword: string) {
  }
}

class Room {
  public status: statusE
  public palyers: palyerInter[] = []
  public round: Round | undefined
  public drawerIndex = 0

  constructor(public roomNumber: string, public roomOwnerId: string, public roomOwnerName: string) {
    this.status = statusE.waitingJoin
  }

  // 有人加入
  joinRoom(palyer: palyerInter) {
    this.palyers.push(palyer)

    // 进入等待开始状态
    if (this.palyers.length > 1) this.status = statusE.waitingStart
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
}

export const createRoomNumber: () => string = () => {
  let number = ''
  for (let i = 0; i < 6; i++) {
    number += Math.round(Math.random() * 9)
  }
  return number
}

const roomList: Map<string, Room> = new Map()

export function createRoom(
  roomNumber: string,
  roomOwnerId: string,
  roomOwnerName: string
) {
  roomList.set(roomNumber, new Room(roomNumber, roomOwnerId, roomOwnerName))
}

export function findRoom(roomNumber: string): Room | undefined {
  return roomList.get(roomNumber)
}