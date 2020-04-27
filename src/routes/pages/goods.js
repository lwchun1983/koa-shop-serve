const Router = require('koa-router')
const {PageAuth} = require('../../middlewares/pageAuth')
const {navigate} = require('../../middlewares/navigate')
const Goods = require('../../controller/goods')

const router = new Router({
  prefix: '/goods'
})

router.get('/', new PageAuth().verify, navigate(), async(ctx) => {
  const {id} = ctx.session.admin
  let {
    admin, 
    goods: {count: goodsTotal, rows: goodsList}
  } = await new Goods(id).list()

  await ctx.render('goods', {
    title: '商品列表',
    navigate: ctx.navigate,
    admin,
    goodsTotal,
    goodsList
  })
})
module.exports = router