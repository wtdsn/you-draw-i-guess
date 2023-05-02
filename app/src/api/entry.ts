import request from "./request";

export function createRoom(name: string) {
  return request({
    url: "/entry/create",
    method: "POST",
    data: {
      name
    }
  })
}
