const Router = require('koa-router')
const {Goods} = require('../../lib/model/goods')
const {PositiveIntegerValidator} = require('../../lib/validate/validator')
const {Success} = require('../../core/http-exception')

const router = new Router({
  prefix: '/api/goods'
})

router.get('/', async (ctx, next) => {
  const draw = parseInt(ctx.query.draw || 0)
  const start = parseInt(ctx.query.start || 0)
  const count = parseInt(ctx.query.length || 10)
  const {count: goodsTotal, rows: goodsList} = await Goods.getAll({
    start,
    count
  })
  const data = goodsList.map(val => {
    const item = {
      goodsName: val.goodsName,
      cname: val.cname,
      goodsImg: val.goodsImg,
      goodsPrice: val.goodsPrice,
      marketPrice: val.marketPrice,
      stock: val.stock,
      saleNum: val.saleNum,
      goodsId: val.goodsId
    }
    return item
  })
  
  ctx.body = {
    draw,
    recordsTotal: goodsTotal,
    recordsFiltered: goodsTotal,
    data
  }
})

router.delete('/delete/:id', async(ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  await Goods.destroy({
    where: {
      goodsId: v.get('path.id')
    }
  })
  throw new Success()
})

module.exports = router