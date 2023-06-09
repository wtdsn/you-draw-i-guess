import Koa from 'koa';
// import session from 'koa-session'
import router from './route/index'
import koaBody from 'koa-body';
import cors from 'koa2-cors'
// ws
import createWsServer from './ws';

const app = new Koa();

// app.keys = ['wtdsn'] // 如果 signed 为 true , 则需要提供
// const CONFIG = {
//   key: 'drawAguess',
//   maxAge: 604800,
//   autoCommit: true,
//   overwrite: true,
//   httpOnly: true,
//   signed: true, // 防篡改签名
//   rolling: true,  // 响应式刷新有效期
//   secure: false  // 是否仅 https 允许
// };

// app.use(session(CONFIG, app));

app.on('error', (err, ctx) => {
  console.error('server error', err)
  // ctx.
});

app.use(koaBody())
app.use(cors());
app
  .use(router.routes())
  .use(router.allowedMethods());
app.listen(9527, () => {
  console.log("app server at :" + 9527);
});

createWsServer().listen(9528, (prot: string) => {
  console.log("ws server at:" + prot);
})