const createTextNode = (text) => {
  return {
    type: 'TEXT',
    props: {
      children: [],
      nodeValue: text
    },
  }
}

const createElement = (type, props, ...children) => {
  delete props.__self
  delete props.__source
  return {
    type: type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child !== 'object') {
          return createTextNode(child)
        }
        return child
      })
    }
    
  }
}

class Component {
  static isClassComponent = true
}

const useState = (state) => {
  return [state, () => {}]
}

const useEffect = (callback, depends) => {
}

export default {
  createElement,
  Component,
  useState,
  useEffect
}