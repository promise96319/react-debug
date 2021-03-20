let nextUnitOfWork = null
let workInProgressRoot = null
let currentRoot = null


// 构建fiber结构
const reconcilerChildren = (workInProgressFiber, children) => {
  // let oldFiber = workInProgressFiber.base && workInProgressFiber.base.child

  let prevSibling = null

  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      node: null,
      base: null,
      parent: workInProgressFiber,
      effectTag: 'REPLACE'
    }

    // 对比
    // if (oldFiber) {
    //   oldFiber = oldFiber.sibling
    // }

    if (index === 0) {
      workInProgressFiber.child = newFiber
    } else {
      prevSibling.sibling = newFiber
    }
    prevSibling = newFiber
  })
}

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

const createNode = (element) => {
  const { type, props } = element
  
  let node = null

  // 如果是文本节点
  if (type === 'TEXT') {
    node = document.createTextNode('')
  } 
  // else if (typeof type === 'function' ) {
  //   if (type.isClassComponent) {
  //     const element = new type(props)
  //     node = createNode(element.render())
  //   } else {
  //     const element = type(props)
  //     node = createNode(element)
  //   }
  // }
   else {
    node = document.createElement(type)
  }

  // todo fragment 节点
  updateNode(node, props)

  return node 
}

const render = (element, container) => {
  // const node = createNode(element)
  // node && container.appendChild(node)
  workInProgressRoot = {
    // 父容器
    node: container,
    // 当前节点
    props: { 
      children: [element]
    },
    // 当前
    base: currentRoot
  }
  nextUnitOfWork = workInProgressRoot
}

const updateHostComponent = (fiber) => {
   if (!fiber.node) {
    //  console.log('fiber node 不存在', fiber)
    fiber.node = createNode(fiber)
  }

  const { children } = fiber.props
  reconcilerChildren(fiber, children)
}

const updateFunctionComponent = (fiber) => {
  const children = fiber.type(fiber.props)
  reconcilerChildren(fiber, [children])
  // console.log(fiber)
}

const updateClassComponent = (fiber) => {
  const ins = new fiber.type(fiber.props)
  const children = ins.render()
  reconcilerChildren(fiber, [children])
}

// fiber链表结构 =》深度遍历
const performUnitOfWork = (fiber) => {
  // 构建fiber结构
  if (typeof fiber.type === 'function') {
    fiber.type.isClassComponent ? updateClassComponent(fiber) : updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  if (fiber.child) {
    return fiber.child
  }
 
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}


const commitWorker = (fiber) => {
  if (!fiber) {
    return
  }

  let parentNodeFiber = fiber.parent
  while (!parentNodeFiber.node) {
    parentNodeFiber = parentNodeFiber.parent
  }
  const parentNode = parentNodeFiber.node

  if (fiber.effectTag === 'REPLACE' &&
    fiber.node !== null) {
    parentNode.appendChild(fiber.node);
  }
  commitWorker(fiber.child)
  commitWorker(fiber.sibling)
}

const commitRoot = (workInProgressRoot) => {
  commitWorker(workInProgressRoot.child)
  currentRoot = workInProgressRoot
  workInProgressRoot = null
}

const workLoop = (deadline) => {
  // 1. 构建 fiber 结构
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  // 2. 渲染 fiber 结构 => fiber - fiber.child -> fiber.sibling
  console.log('结束', workInProgressRoot);
  if (workInProgressRoot) {
    commitRoot(workInProgressRoot)
  }
}

requestIdleCallback(workLoop)

export default {
  render
}