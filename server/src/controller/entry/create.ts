import createUni from '@src/utils/uni'
import { createRoom, findRoom, createRoomNumber } from '@src/db/game'

function create(ctx: any) {
  const { name } = ctx.request.body
  if (!name) {
    ctx.throw(400, "参数错误")
    return
  }

  // 创建房间
  const ownerId = createUni('u')
  let roomNumber = createRoomNumber()
  let maxRetry = 3
  while (maxRetry && findRoom(roomNumber)) {
    maxRetry--
    roomNumber = createRoomNumber()
  }
  if (!maxRetry) {
    ctx.body = {
      code: 0,
      msg: "创建失败"
    }
    return
  }

  createRoom(roomNumber, ownerId, name)

  ctx.body = {
    code: 1,
    msg: "创建成功！",
    data: roomNumber
  }
}

export default create