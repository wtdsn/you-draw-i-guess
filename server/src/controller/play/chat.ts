import { Connect } from "@src/utils/socket-h";

export function chat(msg: string, connect: Connect) {
  console.log('/chat', msg, typeof msg)
  console.log(JSON.parse(msg));
  connect.send({
    code: 1,
    msg: "hello"
  })
}

