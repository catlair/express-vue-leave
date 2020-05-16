## 后端技术栈
 
- node
- Koa2
   - koa-router
   - koa-bodyparser
   - ...
- jsonwebtoken
- gd-bmp
- mongodb
   - mongoose

开发时依赖:

- nodemon node热更新
- apidoc api文档生成

使用`pm2`守护`node`进行运行

## npm 命令

### 使用热更新启动项目

```
npm run dev
```

### 生成apidoc文件

```
npm run apidoc
```

### 守护进程启动项目

```
npm run start
```