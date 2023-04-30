export function game(msg: string, server: any) {
  console.log('/game', msg, typeof msg)
  console.log(JSON.parse(msg));
  server.send({
    code: 1,
    msg: "hello game"
  })
}

