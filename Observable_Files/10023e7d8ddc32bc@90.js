// https://observablehq.com/@bcardiff/observable-columns@90
import define1 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md`# Observable columns
_great for inputs_

~~~js
import {columns} from "@bcardiff/observable-columns"
~~~
`
)}

function _2(md){return(
md`It can be used with objects`
)}

function _values(columns,select){return(
columns({
  seasons: select(["Spring", "Summer", "Fall", "Winter"]),
  stooges: select({
    title: "Stooges",
    description: "Please pick your favorite stooge.",
    options: ["Curly", "Larry", "Moe", "Shemp"],
    value: "Moe"
  })
})
)}

function _4(values){return(
values
)}

function _5(md){return(
md`Or with arrays`
)}

function _numOfInputs(number){return(
number({title: 'how many inputs?', value: 3})
)}

function _arrayOfInputs(numOfInputs,select,columns)
{
  const inputs = []
  for(let i = 0; i < numOfInputs; i++) {
    inputs.push(select({title: `arrayOfInputs[${i}]`, options: ["a","b","c"]}))
  }
  
  return columns(inputs)
}


function _8(arrayOfInputs){return(
arrayOfInputs
)}

function _columns(html){return(
(args) => {
  const form = html`<form></form>`
  form.value = {}

  let cols = 0
  for (const key in args) {
    form.appendChild(args[key])
    cols++
  }
  
  form.style = `display: grid; grid-gap: 10px 15px; grid-template-columns: repeat(${cols}, auto); grid-auto-flow: row;`
  
  form.oninput = () => {
    form.value = Object.keys(args).reduce((result, key) => {
      result[key] = args[key].value
      return result
    }, Array.isArray(args) ? [] : {})
  }
  form.oninput()
  
  return form
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof values")).define("viewof values", ["columns","select"], _values);
  main.variable(observer("values")).define("values", ["Generators", "viewof values"], (G, _) => G.input(_));
  main.variable(observer()).define(["values"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer("viewof numOfInputs")).define("viewof numOfInputs", ["number"], _numOfInputs);
  main.variable(observer("numOfInputs")).define("numOfInputs", ["Generators", "viewof numOfInputs"], (G, _) => G.input(_));
  main.variable(observer("viewof arrayOfInputs")).define("viewof arrayOfInputs", ["numOfInputs","select","columns"], _arrayOfInputs);
  main.variable(observer("arrayOfInputs")).define("arrayOfInputs", ["Generators", "viewof arrayOfInputs"], (G, _) => G.input(_));
  main.variable(observer()).define(["arrayOfInputs"], _8);
  main.variable(observer("columns")).define("columns", ["html"], _columns);
  const child1 = runtime.module(define1);
  main.import("select", child1);
  main.import("number", child1);
  return main;
}
