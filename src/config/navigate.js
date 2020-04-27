/**
 * 后台导航配置
 */

const navigate = [
  {
    name: '主页面',
    path: '/',
    iconClass: 'icon-air-play',
    children: []
  },
  {
    name: '商品管理',
    path: '/goods',
    iconClass: 'icon-gift2',
    children: [
      {
        name: '商品分类',
        path: '/goods/category'
      },
      {
        name: '商品列表',
        path: '/goods'
      }
    ]
  },
  {
    name: '会员管理',
    path: '/user',
    iconClass: 'icon-man-woman',
    children: [
      {
        name: '会员列表',
        path: '/user'
      },
      {
        name: '会员地址',
        path: '/user/address'
      }
    ]
  },
  {
    name: '订单管理',
    path: '/order',
    iconClass: 'icon-abacus',
    children: [
      {
        name: '订单列表',
        path: '/order'
      }
    ]
  },
  {
    name: '网站设置',
    path: '/settings',
    iconClass: 'icon-settings',
    children: [
      {
        name: '网站配置',
        path: '/settings'
      },
      {
        name: '轮播图',
        path: '/settings/swiper'
      },
      {
        name: '友情链接',
        path: '/settings/links'
      }
    ]
  }
]

module.exports = {
  navigate
}
