const Router = require('koa-router')
const {PageAuth} = require('../../middlewares/pageAuth')
const {navigate} = require('../../middlewares/navigate')
const Home = require('../../controller/home')
const {dateFormat} = require('../../core/util')
const router = new Router()

router.get('/', new PageAuth().verify, navigate(), async (ctx, next) => {
  const {id} = ctx.session.admin
  let {
    admin, 
    goods: {count: goodsTotal, rows: goodsList},
    users: {count: userTotal, rows: userlist}
  } = await new Home(id).index()

  userlist = userlist.map(item => {
    item.regTime = dateFormat('YYYY-mm-dd HH:MM', new Date(item.regTime * 1000))
    item.lastLoginTime = dateFormat('YYYY-mm-dd HH:MM', new Date(item.lastLoginTime * 1000))
    return item
  })
  await ctx.render('index', {
    title: '商城后台',
    navigate: ctx.navigate,
    admin,
    goodsTotal,
    goodsList,
    userTotal,
    userlist
  })
})

router.get('/login', async (ctx, next) => {
  const username = ctx.session.username || ''
  await ctx.render('login', {
    title: '商城后台登录页面',
    username
  })
})

router.get('/logout', async (ctx) => {
  ctx.session.admin = null
  ctx.response.redirect("/")
})

module.exports = router