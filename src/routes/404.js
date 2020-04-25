const router = require('koa-router')()

router.get('/404', async function (ctx, next) {
  console.log('query', ctx.query)
  const msg = ctx.query.msg || '您访问的页面找不回来了'
  await ctx.render('404', {
    title: 404,
    msg
  })
})

module.exports = router
