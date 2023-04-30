// 发起连接，即进入房间
// 再一次校验房间可加入

import join from './join'

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

    if (body.type === 'join') {
      return join(body.data, connect)
    }
    
  } catch (err) {
    connect.send({
      code: 0,
      msg: "参数错误"
    })
  }
}