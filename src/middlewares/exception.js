const {HttpException} = require('../core/http-exception')
const { environment } = require('../config/config')
const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        const isHttpException = error instanceof HttpException
        const isDev = environment === 'dev'
        
        if(isDev && !isHttpException){
            throw error
        }

        if (isHttpException) {
            ctx.body = {
              message: error.message,
              errorCode: error.code,
              request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = error.status
        } else {
            ctx.body = {
              message: '服务器内部错误',
              errorCode: 999,
              request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500
        }
        
    }
}

module.exports = catchError