const {Sequelize, Model, Op} = require('sequelize')
const {sequelize} = require('../../core/db')
const {prefix} = require('../../config/config').database
const {OutOfRange} = require('../../core/http-exception')
const {Category} = require('./category')

const MAX_LIMIT = 100

class Goods extends Model{
  static async getAll ({type = 1, catId = 0, isTop = false,start = 0,count = 20, sortField = 'goods_id', sortType='DESC', fields= [], attrExclude = []} = {}) { // isTop 是否一级分类搜索
    if (count > MAX_LIMIT) {
      throw new OutOfRange('单次查询不能超过' + MAX_LIMIT)
    }
    const attributes = {
      exclude: ['content']
    }
    if (attrExclude.length > 0) {
      attributes.exclude = attributes.exclude.concat(attrExclude)
    }
    if (fields.length > 0) {
      attributes.include = fields
    }
    const where = {}
    const categoryWhereOpts = {}
    if (catId > 0) {
      if (isTop) {
        where.pcatId = catId
      } else {
        where.catId = catId
        categoryWhereOpts.id = catId
      }
    }
    where.type = type
    const result = await Goods.findAndCountAll({
      where,
      order: [[sortField, sortType]],
      offset: start,
      limit: count,
      attributes,
      include: [
        {
          model: Category,
          attributes: ['name'],
          where: categoryWhereOpts
        }
      ]
    })
    const list = result.rows.map( item => {
      item.cname = item.Category.name
      return item
    })
    return {
      count: result.count,
      rows: list
    }
  } 
}

const tableName = prefix + 'goods'
Goods.init({
  goodsId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  goodsName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  goodsImg: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: ''
  },
  goodsPrice: {
    type: Sequelize.DECIMAL(10,2),
    defaultValue: '0.00'
  },
  marketPrice: {
    type: Sequelize.DECIMAL(10,2),
    defaultValue: '0.00'
  },
  catId: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  pcatId: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  saleNum: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  isNew: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },
  isSales: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '是否促销'
  },
  isRecommend: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '是否推荐' 
  },
  maxBuy: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    comment: '最大购买数量' 
  },
  content: Sequelize.TEXT,
  stock: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    comment: '库存' 
  },
  type: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '标记哪个项目' 
  },
  point: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    comment: '购买赠送积分' 
  },
}, {
  sequelize,
  tableName,
  timestamps: false
})

Goods.belongsTo(Category, {
  foreignKey: 'catId'
})

module.exports = {
  Goods
}