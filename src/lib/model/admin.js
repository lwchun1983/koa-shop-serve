const {Sequelize, Model} = require('sequelize')
const bcrypt = require('bcryptjs')
const {sequelize} = require('../../core/db')
const {prefix} = require('../../config/config').database
const {AuthFailed} = require('../../core/http-exception')

class Admin extends Model{
  static async getInfo (id) {
    return await Admin.findOne({
      where: {
        id
      }
    })
  }
  static async register (username, password, nickname) {
    return await Admin.create({
      username,
      password,
      nickname
    })
  }
  static async login (username, password) {
    const user = await Admin.findOne({
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
    await Admin.updateUserLoginTime(user.id)
    return user
  }
  static async updateUserLoginTime (uid) {
    await Admin.update({
        lastLoginTime: Math.round(Date.now() / 1000)
    }, {
        where: {
            id: uid
        }
    })
  }

}

const tableName = prefix + 'admin'

Admin.init({
    nickname: {
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
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      set (val) {
        const salt = bcrypt.genSaltSync(10)
        console.log('password:', val, salt)
        const pwd = bcrypt.hashSync(val, salt)
        this.setDataValue('password', pwd)
      }
    },
    scoped: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '管理员权限'
    }
},{
    sequelize,
    tableName,
    timestamps: false
})

module.exports = {
  Admin
}