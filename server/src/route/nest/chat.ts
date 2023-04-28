import Router from '@koa/router'

const router = new Router()

router.get('/chat', (ctx, next) => {
  ctx.body = '/chat'
})

export default router