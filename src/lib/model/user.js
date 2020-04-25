const {Sequelize, Model} = require('sequelize')
const bcrypt = require('bcryptjs')
const {sequelize} = require('../../core/db')
const {AuthFailed, OutOfRange} = require('../../core/http-exception')
const {generateToken} = require('../../core/util')
const {Auth} = require('../../middlewares/auth')
const {prefix} = require('../../config/config').database
const MAX_LIMIT = 100

class User extends Model{
  static async getAll ({where={},fields=[], start = 0,count = 20} = {}) {
    if (count > MAX_LIMIT) {
      throw new OutOfRange('单次查询不能超过' + MAX_LIMIT)
    }
    const attributes = {
      exclude: ['reg_time', 'last_login_time','password']
    }
    if (fields.length > 0) {
      attributes.include = fields
    }
    const result = await User.findAndCountAll({
      where,
      attributes,
      offset: start,
      limit: count,
      order: [['reg_time', 'desc']]
    })
    return result
  }
  static async loginByUserPwd (username, password) {
    const user = await User.findOne({
      where: {
        username
      }
    })
    if (!user) {
      throw new AuthFailed('账号不存在')
    }
    const verify = bcrypt.compareSync(password, user.password)
    if (!verify) {
      throw new AuthFailed('密码错误')
    }
    await User.updateUserLoginTime(user.id)
    return generateToken(user.id, Auth.USER)
  }
  static async getInfo (uid) {
    const user = await User.findOne({
      where: {
        id: uid
      },
      attributes: {
        exclude: ['id', 'openid', 'reg_time', 'last_login_time','password']
      }
    })
    return user
  }
  static async getUserByOpenid (openid) {
    const user = await User.findOne({
      where: {
        openid
      }
    })
    return user
  }
  static async registerByOpenid(openid) {
    return await User.create({
      openid
    })
  }
  static async updateUserLoginTime (uid) {
    await User.update({
      lastLoginTime: Math.round(Date.now() / 1000)
    }, {
      where: {
        id: uid
      }
    })
  }
}

const tableName = prefix + 'user'

User.init({
  openid: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  nickname: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  avatar: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  regTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue () {
      return Math.round(Date.now() / 1000)
    }
  },
  lastLoginTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  sex: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },
  born: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  serialSign: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '连续签到天数'
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '用户积分'
  },
  level: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  password: {
    type: Sequelize.STRING,
    set (val) {
      const salt = bcrypt.genSaltSync(10)
      console.log('password:', val)
      const pwd = bcrypt.hashSync(val, salt)
      this.setDataValue('password', pwd)
    }
  }
},{
  sequelize,
  tableName,
  timestamps: false
})

module.exports = {
  User
}