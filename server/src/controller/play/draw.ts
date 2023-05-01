import { findRoom } from '@src/db/game'
// 声明
import { Connect } from "@src/utils/socket-h";
import { drawInfoInter } from './Room';
export default function draw(body: drawInfoInter, connect: Connect
) {
  const { x1, x2, y1, y2, color } = body
  if (!(x1 && x2 && y1 && y2 && color)) {
    throw Error('参数错误')
  }

  const room = findRoom(connect.store.roomNumber)
  if (!room || room.palyers[room.drawerIndex].uid !== connect.store.uid) {
    throw Error('请求失败')
  } else {
    room.noticeDraw(body)
  }
}