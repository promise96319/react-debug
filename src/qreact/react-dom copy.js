const updateNode = (node, props) => {
  const { children, ...rest } = props || {}
  Object.entries(rest).forEach(([key, value]) => {
    if (key.toLocaleLowerCase().indexOf('on') === 0) {
      node.addEventListener(key.toLocaleLowerCase().slice(2), value)
    } else {
      node[key] = value
    }
  })
}

const reconcilerChildren = (element, node) => {
  const children = element.props.children
   if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        render(child, node)
      })
    } else {
      render(children, node)
    }
  }
}

const createNode = (element) => {
  const { type, props } = element
  
  let node = null

  // 如果是文本节点
  if (type === 'TEXT') {
    node = document.createTextNode('')
  } else if (typeof type === 'function' ) {
    if (type.isClassComponent) {
      const element = new type(props)
      node = createNode(element.render())
    } else {
      const element = type(props)
      node = createNode(element)
    }
  } else {
    node = document.createElement(type)
  }
  // fragment 节点

  reconcilerChildren(element, node)

  updateNode(node, props)

  return node 
}

const render = (element, container) => {
  const node = createNode(element)
  node && container.appendChild(node)
}

export default {
  render
}