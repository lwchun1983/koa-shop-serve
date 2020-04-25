/**
 * @description 后台主页控制器
 * @author LeviLee
 */
const {Admin} = require('../lib/model/admin')
const {Goods} = require('../lib/model/goods')
const {User} = require('../lib/model/user')

class Home {
  constructor (adminId) {
    this.adminId = adminId
  }
  async index () {
    const admin = await Admin.getInfo(this.adminId)
    const goods = await Goods.getAll({count: 10})
    const users = await User.getAll({count: 10})
    return {admin, goods, users}
  }
}

module.exports = Home