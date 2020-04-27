/**
 * @description 后台商品管理控制器
 * @author LeviLee
 */
const {Admin} = require('../lib/model/admin')
const {Goods:GoodsModel} = require('../lib/model/goods')
// const {Category} = require('../lib/model/category')

class Goods {
  constructor (adminId) {
    this.adminId = adminId
  }
  async list () {
    const admin = await Admin.getInfo(this.adminId)
    const goods = await GoodsModel.getAll({count: 10})
    return {admin, goods}
  }
}

module.exports = Goods