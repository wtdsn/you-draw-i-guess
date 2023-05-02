// 使用 fetch 封装请求
// 增加请求拦截和响应拦截
// 导出泛型接口
import { qs } from "utils-h"

interface headersIn {
  [ket: string]: string
}

interface queryObj {
  [ket: string]: string
}
interface dataObj {
  [ket: string]: any
}

interface configIn {
  baseUrl?: string,
  url?: string,
  method?: "GET" | "POST" | "DELETE" | "PUT" | "OPTIONS",
  timeOut?: number,
  headers?: headersIn,
  query?: queryObj,
  data?: string | dataObj | FormData
}

interface beforeRequestIn {
  (config: configIn): configIn
}

interface responseIn {
  status: number,
  statusText: string,
  data: any
}


type afterResponse = [(reponse: responseIn) => any, (err: responseIn) => any]

// fetch 类
export class FetchH {
  public beforeRequest?: beforeRequestIn
  public afterResponse?: afterResponse
  constructor(public config: configIn = {}) {

  }

  request(config: configIn) {
    config = mergeCongig(config, this.config)

    if (this.beforeRequest) {
      config = this.beforeRequest(config)
    }

    let { url, init } = getFetchParams(config)

    return fetch(url, init)
      // 处理数据
      .then(v => {
        let {
          statusText,
          status
        } = v
        if (statusText === 'OK') {
          return v.json().then(v => {
            return {
              statusText: "OK",
              status,
              data: v
            }
          })
        } else {
          return v.text().then(v => {
            return {
              statusText,
              status,
              data: v
            }
          })
        }
      })
      // 响应拦截
      .then(v => {
        if (v.statusText === 'OK') {
          if (this.afterResponse && this.afterResponse[0]) {
            return this.afterResponse[0](v)
          }
        } else {
          if (this.afterResponse && this.afterResponse[1]) {
            return this.afterResponse[1](v)
          }
        }
        return v
      })
  }
}

interface fetchParamsIn {
  url: string,
  init: RequestInit
}

// 合并配置
function mergeCongig(config1: configIn, config2: configIn): configIn {
  // 1. headers 合并，其他的 config1 覆盖 config2
  let newConfig: configIn = {
    ...(config2 || {}),
    ...(config1 || {}),
    headers: {
      ...(config2.headers || {}),
      ...(config1.headers || {})
    }
  }

  return newConfig
}

// 将配置处理成 fetch 的参数
function getFetchParams(config: configIn): fetchParamsIn {
  let url: string = (config?.baseUrl || '') + config.url

  if (config.query) {
    url = qs.setQuery(url, config.query)
  }

  let init: RequestInit = {
    method: config.method || 'GET',
    headers: config.headers || {}
  }

  if (init.method === "POST" && config.data) {
    if (config.data instanceof FormData) {
      init.body = config.data
    } else if (config.data instanceof Object) {
      (init.headers as any)['Content-Type'] = 'application/json'
      init.body = JSON.stringify(config.data)
    }
    else
      init.body = config.data as BodyInit
  }

  return {
    url,
    init
  }
}

export interface requestIn<T = Promise<any>> {
  (config: configIn): T
  setBeforeRequest: (cb: beforeRequestIn) => any
  setAfterResponsse: (suc: afterResponse[0], err: afterResponse[1]) => any
}

// 创建请求方法
export default function createFetchH(config: configIn = {}): requestIn {
  const fetchH = new FetchH(config)
  const request: any = fetchH.request.bind(fetchH)

  request.setBeforeRequest = function (cb: beforeRequestIn) {
    fetchH.beforeRequest = cb
  }

  request.setAfterResponsse = function (suc: afterResponse[0], err: afterResponse[1]) {
    fetchH.afterResponse = [suc, err]
  }

  return request as requestIn
}


