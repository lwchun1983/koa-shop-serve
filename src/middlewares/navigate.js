/**
 * @description 后台统一的导航设置
 */
const {navigate} = require('../config/navigate')

module.exports = {
  navigate () {
    return async (ctx, next) => {
      const currentPath = ctx.path 
      ctx.navigate = navigate.map(item => {
        item.active = item.path === currentPath
        item.children = item.children.map(val => {
          val.active = val.path === currentPath
          return val
        })
        return item
      })
      await next()
    }
  }
}
