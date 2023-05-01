import { findRoom } from '@src/db/game'
import { statusE } from '@src/../../share/game'
import { chooseTime, drawTime } from './Room'

export function showKeyWords(ctx: any) {
  const { uid, roomNumber } = ctx.request.body
  if (!uid) {
    ctx.throw(400, "参数错误")
    return
  }

  // 查找房间
  let room = findRoom(roomNumber)

  if (!room || room.status !== statusE.choosing || room.palyers[room.drawerIndex].uid !== uid) {
    ctx.body = {
      code: 0,
      msg: "请求失败"
    }
    return
  }

  ctx.body = {
    code: 1,
    msg: "请求成功！",
    data: {
      time: chooseTime,
      list: room.round!.getWordsList()
    }
  }
}


export function chooseKeyWord(ctx: any) {
  const { uid, roomNumber, keyWord } = ctx.request.body
  if (!uid || !roomNumber || !keyWord) {
    ctx.throw(400, "参数错误")
    return
  }
  // 查找房间
  let room = findRoom(roomNumber)

  if (!room || room.status !== statusE.choosing || room.palyers[room.drawerIndex].uid !== uid) {
    ctx.body = {
      code: 0,
      msg: "请求失败"
    }
    return
  }

  room.setKeyWord(keyWord)

  ctx.body = {
    code: 1,
    msg: "请求成功！",
    data: {
      time: drawTime
    }
  }
}