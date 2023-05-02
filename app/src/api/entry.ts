import request from "./request";
import { PromiseResIn } from "./request";


export function createRoom(name: string): PromiseResIn<string> {
  return request({
    url: "/entry/create",
    method: "POST",
    data: {
      name
    }
  })
}


export function joinByNumber(name: string, roomNumber: string): PromiseResIn<string> {
  return request({
    url: "/entry/joinByNumber",
    method: "POST",
    data: {
      name,
      roomNumber
    }
  })
}