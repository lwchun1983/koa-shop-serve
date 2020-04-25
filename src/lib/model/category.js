const {Sequelize, Model} = require('sequelize')
const {sequelize} = require('../../core/db')
const {prefix} = require('../../config/config').database
const ATTRIBUTES = ['id', 'parent_id', 'name', 'img']
class Category extends Model {
  static async getCategoryAll (type = 0) {
    const list = await Category.findAll({
      where:{
        type
      },
      attributes: ATTRIBUTES, 
    })
    return list
  }

  static async getCategoryList (type = 0, id = 0) {
    const list = await Category.findAll({
      where:{
        type,
        parentId: id
      },
      attributes: ATTRIBUTES, 
    })
    return list
  }
}

const tableName = prefix + 'category'
Category.init({
  name: {
      type: Sequelize.STRING(50),
      allowNull: false
  },
  parentId: {
      type: Sequelize.INTEGER,
      defaultValue: 0
  },
  img: {
      type: Sequelize.STRING,
      defaultValue: '',
      allowNull: false
  },
  type: {
      type: Sequelize.TINYINT,
      defaultValue: 0
  }
}, {
  sequelize,
  tableName,
  timestamps: false
})

module.exports = {
    Category
}