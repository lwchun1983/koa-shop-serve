const categoryTree = function (data, parentId = 0) {
  const res = []
  data.forEach(item => {
    if (item.parent_id === parentId) {
      item.children = categoryTree(data, item.id)
      res.push(item)
    }
  })
  return res
}

module.exports = {
  categoryTree
}
