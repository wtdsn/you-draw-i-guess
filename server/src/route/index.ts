// import chat from './nest/chat'
// import draw from './nest/draw'
import enrty from './nest/entry'

import Router from '@koa/router'

const router = new Router()

router
  .use(enrty.routes())
// .use(chat.routes())
// .use(draw.routes())


export default router
