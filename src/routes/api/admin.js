const Router = require('koa-router')
const {LoginValidator} = require('../../lib/validate/validator')
const {Success} = require('../../core/http-exception')
const {Admin} = require('../../lib/model/admin')

const router = new Router({
  prefix: '/api/admin'
})

router.post('/login', async (ctx, next) => {
  const v = await new LoginValidator().validate(ctx)
  const admin = await Admin.login(v.get('body.username'), v.get('body.password'))
  if (v.get('body.remember') == 1) {
    ctx.session.username = v.get('body.username')
  } else {
    ctx.session.username = null
  }
  ctx.session.admin = {
    id: admin.id,
    username: admin.username,
    scoped: admin.scoped
  }
  throw new Success()
})


module.exports = router