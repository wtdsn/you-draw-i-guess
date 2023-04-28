import Koa from 'koa';
import session from 'koa-session'
import router from './route/index'
import koaBody from 'koa-body';

const app = new Koa();

app.keys = ['wtdsn'] // 如果 signed 为 true , 则需要提供
const CONFIG = {
  key: 'drawAguess',
  maxAge: 604800,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true, // 防篡改签名
  rolling: true,  // 响应式刷新有效期
  secure: false  // 是否仅 https 允许
};

app.use(session(CONFIG, app));

app.on('error', (err) => {
  console.error('server error', err)
});

app.use(koaBody())
app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(9527);