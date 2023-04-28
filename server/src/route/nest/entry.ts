import Router from '@koa/router'
import create from '@src/controller/entry/create'

const router = new Router({
  prefix: '/entry'
})

router.post('/create', create)

router.post('/join', (ctx, next) => {
  ctx.body = 'join'
})

export default router