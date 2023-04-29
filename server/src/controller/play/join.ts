export function chat(msg: string, server: any) {
  console.log('/join', msg, typeof msg)
  console.log(JSON.parse(msg));
  server.send({
    code: 1,
    msg: "hello"
  })
}

