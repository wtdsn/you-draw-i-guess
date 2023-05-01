import Router from '@koa/router'
import { showKeyWords, chooseKeyWord } from '@src/controller/play/choose'
const router = new Router({
  prefix: '/game'
})

router.post('/showKeyWords', showKeyWords)

router.post('/chooseKeyWord', chooseKeyWord)

export default router