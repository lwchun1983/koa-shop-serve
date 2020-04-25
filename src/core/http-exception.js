class HttpException extends Error{
  constructor () {
    super()
    this.code = 999
    this.message = '服务器未知错误'
    this.status = 500
  }
}

class ParameterException extends HttpException{
  constructor (msg = '参数错误', code = 10000) {
    super()
    this.message = msg
    this.code = code
    this.status = 400
  }
}

class Success extends HttpException{
  constructor(msg = 'ok', code = 0){
    super()
    this.status = 201
    this.message = msg
    this.code = code
  }
}

class AuthFailed extends HttpException {
  constructor(msg = '授权失败', code = 10004){
    super()
    this.status = 401
    this.message = msg
    this.code = code
  }
}

class Forbbiden extends HttpException{
  constructor(msg = '禁止访问', code = 10006){
    super()
    this.status = 403
    this.message = msg
    this.code = code
  }
}

class OutOfRange extends HttpException {
  constructor(msg = '超过范围', code = 10001){
      super()
      this.code = 400
      this.message = msg
      this.code = code
  }
}

module.exports = {
  HttpException,
  ParameterException,
  Success,
  AuthFailed,
  Forbbiden,
  OutOfRange
}