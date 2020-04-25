const { LinValidator, Rule } = require('../../core/lin-validator')


class PositiveIntegerValidator extends LinValidator {
    constructor () {
        super()
        this.id = [
            new Rule('isInt', '需要是非负整数', {
                min: 1
            })
        ]
    }
}

class LoginValidator extends LinValidator {
  constructor () {
    super()
    this.username = [
      new Rule('isLength', '不符合长度规范', { min: 3 })
    ]
    this.password = [
      new Rule('isLength', '至少6位', { min: 6, max: 128 })
    ]
  }
}


module.exports = {
  PositiveIntegerValidator,
  LoginValidator
}