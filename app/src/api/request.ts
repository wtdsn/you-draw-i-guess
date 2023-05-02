import createFetchH from "../utils/request";

const baseUrl = 'http://localhost:9527'

const request = createFetchH({
  baseUrl
})

request.setBeforeRequest((config) => config)

request.setAfterResponsse((response) => {
  console.log(response)
  return response
}, (err) => {
  console.log(err)
})


export default request
