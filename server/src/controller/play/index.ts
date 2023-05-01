// 发起连接，即进入房间
// 再一次校验房间可加入

import join from './join'
import chat from './chat'
import startGame from './startGame'

// 声明
import { Connect } from '@src/utils/socket-h'

interface bodyInter {
  type: "join" | "chat" | "draw" | 'start',
  data?: any
}

export function game(msg: string, connect: Connect) {
  let body: bodyInter
  try {
    body = JSON.parse(msg) as bodyInter
    switch (body.type) {
      case 'chat':
        return chat(body.data, connect)
      case 'draw':
        return join(body.data, connect)
      case 'join':
        return join(body.data, connect)
      case 'start':
        return startGame(connect)
      default:
        throw Error('参数错误')
    }
  } catch (err: any) {
    connect.send({
      code: 0,
      msg: err.message || "参数错误"
    })
  }
}