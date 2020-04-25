const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const requireDerectory = require('require-directory')
const Router = require('koa-router')
const { SESSION_SECRET_KEY } = require('./config/config')
const catchError = require('./middlewares/exception')

// const index = require('./routes/index')
// const users = require('./routes/users')

// error handler
// onerror(app)
app.use(catchError)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// session
app.keys = [SESSION_SECRET_KEY]
app.use(session({
  key: 'shop:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}, app))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 处理404页面
app.use(async (ctx, next) => {
  await next()
  if(parseInt(ctx.status) === 404 ){
    if (!!ctx.header.referer) {
      ctx.body = {
        errorCode: -1,
        message: '请求接口不存在'
      }
      ctx.status = 404
    } else {
      ctx.response.redirect("/404")
    }
  }
})

// routes
requireDerectory(module, './routes', {visit: whenModuleLoad})
function whenModuleLoad (obj) {
  if(obj instanceof Router){
    app.use(obj.routes(), obj.allowedMethods())
  }
}


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
