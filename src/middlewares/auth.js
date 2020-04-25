const jwt = require('jsonwebtoken')
const basicAuth = require('basic-auth')
const {Forbbiden} = require('../core/http-exception')
class Auth {
  constructor (level = 1) {
      this.level = level
  }
  get verify () {
    return async (ctx, next) => {
      const token = basicAuth(ctx.req)
      let errMsg = 'token不合法'
      if (!token || !token.name) {
        throw new Forbbiden(errMsg)
      }
      try {
        var res = jwt.verify(token.name, global.config.security.secretKey)
      } catch (error) {
        if (error.name == 'TokenExpiredError'){
            errMsg = 'token已过期'
        }
        throw new Forbbiden(errMsg)
      }
      if (res.scope < this.level) {
        errMsg = '权限不足'
        throw new Forbbiden(errMsg)
      }
      ctx.auth = {
        uid: res.uid,
        scope: res.scope
      }
      await next()
    }
  }
  static verifyToken (token) {
    try {
      jwt.verify(token, global.config.security.secretKey)
      return true
    } catch (err) {
      return false
    }
  }
}
Auth.USER = 8
module.exports = {
  Auth
}