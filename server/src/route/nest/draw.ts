import Router from '@koa/router'

const router = new Router()

router.post('/draw', (ctx, next) => {
  ctx.body = 'draw'
})

export default router