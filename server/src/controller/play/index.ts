// 发起连接，即进入房间
// 再一次校验房间可加入

import join from './join'
import chat from './chat'

// 声明
import { Connect } from '@src/utils/socket-h'

interface bodyInter {
  type: "join" | "chat" | "draw",
  data: any
}

export function game(msg: string, connect: Connect) {
  let body: bodyInter
  try {
    body = JSON.parse(msg) as bodyInter
    switch (body.type) {
      case 'join':
        return join(body.data, connect)
      case 'chat':
        return chat(body.data, connect)
      case 'draw':
        return join(body.data, connect)
      default:
        Error('参数错误')
    }
  } catch (err) {
    connect.send({
      code: 0,
      msg: "参数错误"
    })
  }
}