# node 中使用 ts 开发
借助 ts-node 和 nodemon
nodemon 监听 文件变化 ， ts-node 把 ts 文件转成 js 文件执行
需要下载 ts-node 和 nodemon --save
然后修改 package.json 文件的命令
```json
  "scripts": {
    "serve": "node ./dist/app.js",
    "watch": "nodemon ./src/app.ts",
    "build": "tsc"
  },
```

使用 nodemon 执行 ./src/app.ts 。相当于 nodemon app.js 。不过 ts 文件会先使用 ts-node 进行处理，当然还需要其他配置

根目录下增加 nodemon.json 文件
```json
{
  "watch": [
    "./src"
  ],
  "ext": "ts",
  "execMap": {
    "ts": "ts-node"
  }
}
```

watch 表示监听的文件或者目录
ext 表示需要处理的文件的扩展名
execMap 表示扩展名对应的处理器，即 ts 文件使用 ts-node 进行处理

提供此过程，会把相关的 ts 转换成 js 。然后交给 node 进行处理

# 解决模块问题
当使用路径别名时，需要在 tsconfig.json 中增加
```json
    "baseUrl": "./",
    "paths": {
      "@src/*": [
        "src/*"
      ]
    },
```

但是， typescript , ts-node , nodemon 都不会处理别名
也就是配置后，vscode 可以识别，能够找到模块 ，ts 也可以找到模块
但是在加载时，并不会处理别名。在 webpack 和 vite 中，它们会提供处理别名的功能。

在 node 中，可以使用 tsconfig-paths 包进行处理。
https://github.com/dividab/tsconfig-paths

在此项目中，只需要做简答的修改就行 , (nodemon.json)
```json
 "execMap": {
    "ts": "ts-node -r tsconfig-paths/register"
  }
```
