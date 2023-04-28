import db from './index'

// todo 抽取一下，使用泛型限制 data
interface createRoomRes {
  code: number,
  msg: string,
  data?: any
}
// 房间号 ， 房主
export let createRoom: (ownerId: string) => createRoomRes = function (ownerId) {
  let userTable = db.getTable('room')
  let roomNumber = createRoomNumber()
  let testTime = 3
  while (testTime && userTable[roomNumber]) {
    roomNumber = createRoomNumber()
    testTime--
  }
  if (!testTime) {
    return {
      code: 0,
      msg: "创建失败！"
    }
  } else {
    let room = {
      roomNumber,
      ownerId: ownerId,
      palyers: [ownerId]
    }
    userTable[roomNumber] = room

    return {
      code: 1,
      msg: "创建成功",
      data: roomNumber
    }
  }
}


let createRoomNumber: () => string = () => {
  let number = ''
  for (let i = 0; i < 6; i++) {
    number += Math.round(Math.random() * 9)
  }
  return number
}