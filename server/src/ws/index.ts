import { createServer } from "@src/utils/socket-h";
import { Server } from "@src/utils/socket-h";

import { game } from "@src/controller/play";
const createWsServer: () => Server = function () {
  const server = createServer((connect) => {
    connect.on('connect', (socket) => {
      console.log("connect success!");
    })

    connect.on('/game', game)

    connect.on('error', (err) => {
      console.log("ws err", err)
      connect.send({
        code: 0,
        msg: "服务器出错"
      })
    })
  })

  return server
}

export default createWsServer