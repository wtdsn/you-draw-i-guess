import Router from '@koa/router'
import createUni from '@src/utils/uni'
const router = new Router({
  prefix: '/entry'
})

router.post('/create', (ctx) => {
  const session = ctx.session!
  console.log(ctx.body);
  const body = JSON.stringify(ctx.request.body)
  console.log(body);

  // 新用户
  if (session.isNew) {
    const id = createUni('u')
    console.log(id);
  }
  ctx.body = '123'
})

router.post('/join', (ctx, next) => {
  ctx.body = 'join'
})

export default router