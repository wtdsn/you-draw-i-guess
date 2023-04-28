import createUni from '@src/utils/uni'
import { createRoom } from '@src/db/room'

function create(ctx: any) {
  const body = ctx.request.body
  if (!body.name) {
    ctx.throw(400, "参数错误")
    return
  }

  // 创建房间
  const ownerId = createUni('u')
  const createRoomRes = createRoom(ownerId)
  if (createRoomRes.code === 0) {
    ctx.throw(400, createRoomRes.msg)
    return
  }
  ctx.body = createRoomRes
  // ctx.body = '123'
}

export default create