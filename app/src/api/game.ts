import request from "./request";
import { PromiseResIn } from "./request";

interface getKeyWordsResIn {
  time: number,
  list: string[]
}
export function getKeyWords(uid: string, roomNumber: number): PromiseResIn<getKeyWordsResIn> {
  return request({
    url: "/game/showKeyWords",
    method: "POST",
    data: {
      uid, roomNumber
    }
  })
}

interface chooseKeyWordResIn {
  time: number
}
export function chooseKeyWord(uid: string, roomNumber: number, keyWord: string): PromiseResIn<chooseKeyWordResIn> {
  return request({
    url: "/game/chooseKeyWord",
    method: "POST",
    data: {
      uid, roomNumber, keyWord
    }
  })
}
