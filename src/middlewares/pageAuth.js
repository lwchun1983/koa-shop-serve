const {Forbbiden} = require('../core/http-exception')
class PageAuth {
  constructor (level = 1) {
    this.level = level
  }
  get verify () {
    return async (ctx, next) => {
      const admin = ctx.session.admin || {}
      if (Object.keys(admin).length === 0) {
        ctx.response.redirect("/login")
      } else {
        // console.log('权限不足', this.level, admin)
        if (this.level > admin.scoped) {
          ctx.response.redirect(`/404?from=${encodeURIComponent(ctx.path)}&msg=权限不足`)
        }
        await next()
      }
    }
  }
}

module.exports = {
  PageAuth
}