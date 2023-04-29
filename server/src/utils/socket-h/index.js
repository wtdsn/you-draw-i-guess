const Server = require('./Server')

exports.createServer = function (cb) {
  return new Server(cb)
}



/* const server = createServer((connect) => {
  connect.on('/chat', (res) => {
    console.log(res);
    connect.send({
      code: 1,
      data: "123"
    })
  })

  connect.on('error', (err, connect) => {
    console.log("err", err);
    connect.send({
      code: 0,
      msg: "错误"
    })
  })

  connect.on('close', () => {
    console.log("close");
  })
})
server.listen(9528) */