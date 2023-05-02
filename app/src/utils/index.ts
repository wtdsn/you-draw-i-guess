// 获取图片数据
export function getAvatarUrl(baseUrl: string, name: string) {
  // return new URL('../../assets/img/avatar/' + name, import.meta.url).href
  return new URL(baseUrl + name, import.meta.url).href
}
