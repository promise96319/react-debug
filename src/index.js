import React from "./qreact/react";
import ReactDOM from "./qreact/react-dom";

import "./index.css";

function Count() {

  const [count, setCount] = React.useState(10)

  return <div className="function component">
    function component
    <div className="count">{count}</div>
    <button className="click"  onClick={() => {setCount(count + 10)}}>click </button>
  </div>
}

class Add extends React.Component {
  render() {
    return <div class="class component">class component</div>
  }
}


// import App from "./App";
const app = (
<div className="border">
  <div  className="border pink">
    hhhh 
    {/* <div className="border green">node 3</div> */}
  </div>

  <Count></Count>
  <Add></Add>
</div>
)

// ReactDOM.render(<App />, document.getElementById("root"));
ReactDOM.render(app, document.getElementById("root"));

// console.log("React", React.version); //sy-log

// 原生标签节点
// 文本节点
// 函数组件
// 类组件
