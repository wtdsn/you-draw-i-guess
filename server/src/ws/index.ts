

import { chat } from "@src/controller/play/chat";
import { createServer } from "@src/utils/socket-h";
import { Server } from "@src/utils/socket-h";

const createWsServer: () => Server = function () {
  const server = createServer((connect) => {
    connect.on('connect', (socket) => {
      console.log("connect success!");
    })

    connect.on('/chat', chat)

    /*   server.on('/draw', (res) => {
        console.log("/draw", res);
        server.send(res + '!!!', () => { })
      }) */

    /*   server.on('/players', (res) => {
        console.log("/players", res);
        server.send(res + '!!!', () => { })
      }) */

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