// https://observablehq.com/@spattana/cap-4720-introduction-to-observable@583
import define1 from "./e93997d5089d7165@2303.js";
import define2 from "./7554367c5d544cb3@226.js";

function _1(md){return(
md`# CAP 4720: Introduction to Observable
`
)}

function _2(md){return(
md`## Rendering a Triangle in WebGL using twgl.`
)}

function _scale(Inputs){return(
Inputs.range([0, 1], {
  value: 0.5,
  step: 0.1,
  label: "scale factor"
})
)}

function _color(colorInput){return(
colorInput()
)}

function _5(DOM,width,hex2rgb,color,twgl,scale)
{
  const myCanvas = DOM.canvas(width, 256);

  const aspect = myCanvas.width / myCanvas.height;
  const gl = myCanvas.getContext("webgl2");

  gl.clearColor(...hex2rgb(color), 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const shaders = {
    vs: `#version 300 es
    in vec2 position;
    in vec3 color;

    uniform float aspect;
    uniform float scale;

    out vec3 fragColor;
    void main () {
      gl_Position = vec4(scale*position/vec2(aspect,1), 0, 1);
      fragColor = color;
    }`,

    fs: `#version 300 es
    precision mediump float;
    out vec4 outColor;
    in vec3 fragColor;
    void main () {
      outColor = vec4(fragColor, 1);
    }`
  };

  const programInfo = twgl.createProgramInfo(gl, [shaders.vs, shaders.fs]);

  const vertexAttributes = {
    position: { numComponents: 2, data: [1, 0, 0, 1, -1, -1] },
    color: { numComponents: 3, data: [1, 0, 0, 0, 1, 0, 0, 0, 1] }
  };

  const uniforms = {
    aspect,
    scale
  };

  const bufferInfo = twgl.createBufferInfoFromArrays(gl, vertexAttributes);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(programInfo.program);

  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);

  return myCanvas;
}


function _6(md){return(
md`---
## Objective : 
To get familiar with Observable and start Coding in it.
`
)}

function _7(md){return(
md`---
## Step 1 : Welcome to Observable !

a. Sign in or create an account if you don't already have one on observablehq.com.        
b. Open a new empty notebook.


`
)}

function _8(md){return(
md`---
## Step 2 : Basics of Observable Notebook.
`
)}

function _9(md){return(
md`### Observable Notebook cells
(Observable notebook consist of __editable__  cells, so try tinkering with the code and learn by trial and error 😊)
                               
Click the __grey pin__ on the left side to keep the code window open, even if you deselect the section.
`
)}

function _10(md){return(
md`
A notebook cell can contain:
- \`Markdown\`
- \`HTML\`
- \`CSS\`
- \`Svg\`
- \`JavaScript(Arrays,Objects,functions/blocks)\`
`
)}

function _11(md){return(
md` Note - Before starting we are assuming you have basic knowledge of HTML, CSS and  Javascript.
`
)}

function _12(md){return(
md`
#### Markdown
Cells can be Markdown:
- [Links](https://observablehq.com)
- Lists
`
)}

function _13(md){return(
md`
#### HTML and Inline CSS
- [HTML](https://www.w3.org/html/)
- [CSS](https://www.w3.org/Style/CSS/Overview.en.html)
`
)}

function _14(html){return(
html`
<div style="height:2em; padding:.5em; background:#C39BD3;">
  <h2 style="color:white;">Hello ! I am some HTML code page inside Observable</h2>
</div>
`
)}

function _15(md){return(
md`#### Canvas

The HTML *canvas* element is used to draw graphics on a web page. The *canvas* element is only a container for graphics. You must use make API calls in Javascript to actually draw the graphics. The Canvas API largely focuses on 2D graphics. The WebGL API, which also uses the *canvas* element, draws hardware-accelerated 2D and 3D graphics.
`
)}

function _16(md){return(
md`#### Basics of Javascript Coding in Observable
Observable notebooks are written in [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript), the web’s native language, but with minor changes. Lets get fimilar with the changes for a smooth landing to D3.js.
`
)}

function _17(md){return(
md`Cells come in two primary forms:
*expressions* and *blocks*. 
`
)}

function _18(md){return(
md`#### Expressions
Expression cells are used for simple definitions, such as basic arithmetic
and you can define your cells in whatever order makes sense (no need to follow a top to bottom order).
`
)}

function _19(x){return(
x * 2
)}

function _x(){return(
100
)}

function _21(md){return(
md`# Blocks
Blocks are surrounded by curly braces, \`{\` and \`}\`, and are used for more complex definitions involving local variables or loops:`
)}

function _22()
{
  let x = 0;
  for (let i = 1; i <= 5; ++i) {
    x += i; // adding numbers from 1 - 5
  }
  return x;
}


function _23(md){return(
md`
#### Javascript Object
(must wrap the literal in parenthesis to differentiate it from a block)
`
)}

function _24(){return(
{top: 50, right: 50, bottom: 50, left: 50}
)}

function _25(md){return(
md`
#### Javascript Array
`
)}

function _data(){return(
[1,2,3,4,5,6]
)}

function _27(md){return(
md`
#### Javascript Function
`
)}

function _printProgram(){return(
(name) => `Program: ${name}`
)}

function _29(printProgram){return(
printProgram("Computer Science")
)}

function _30(md){return(
md ` #### Parts of ES6 (the latest version of Javascript) that might be new and useful to you:
* __Arrow functions__: \`d => d.xPosition\` is equivalent to                                        
\`function(d)
{return d.xPosition\` }
* __New variable types__: Say no to var to declare variables. Use **const** for constants, and **let** for variables. 
`
)}

function _31(md){return(
md`---
### Loading External Data in Observable`
)}

function _32(md){return(
md`
You can use the following easy ways of loading data in your notebook for analysis and visualization.

- Load Inline  - If you want to load a small amount of data, you can embed it in your notebook as code. This can be done using the above-mentioned javascript objects or arrays.
                                          
- Load Files - If you want large amounts of data, you can load files (of less than 15 MB). These files are private to the notebook.

Note - You can also fetch (or soFetch) files uploaded and hosted on outside services as long as they support [CORS](https://enable-cors.org/).
`
)}

function _33(md){return(
md`Example of loading an external data file`
)}

async function _teapotObjData(soFetch){return(
(
  await soFetch(
    "https://groups.csail.mit.edu/graphics/classes/6.837/F03/models/teapot.obj"
  )
).text()
)}

function _35(md){return(
md`#### Attaching Files

Local files can be attached directly to your notebook in two ways:
                                                                                
1) Pass the file’s name to the built-in FileAttachment function then call the appropriate method depending on how you want to consume the file such as JSON, text, etc..    
                                                          
2) While editing a cell, hit keys "Cmd-Shift-U" or ("Ctrl-Shift-U") to choose a local file. This will automatically insert the code to reference these files, and if you own the notebook, the data will immediately start uploading.
`
)}

function _downloads(md){return(
md`#### Downloads
       
You can download your data from notebook as CSV or JSON by clicking on the three little dots at the top of the cell menu option on the left of a cell. Try it on any of the data cells.
`
)}

function _37(md){return(
md`In addition to the built-in cell download menu items, you can download any file using the built-in DOM.download function.    
Try downloading the teapotObjData (loaded above) as JSON by clicking the button below:`
)}

function _38(DOM,data){return(
DOM.download(
  new Blob([JSON.stringify(data)], {
    type: "application/json"
  }),
  "teapot.obj"
)
)}

function _39(md){return(
md`---
### Require JavaScript libraries and import Observable tools`
)}

function _hex2rgb(){return(
(hex) =>
  (hex = hex.replace("#", ""))
    .match(new RegExp("(.{" + hex.length / 3 + "})", "g"))
    .map((l) => parseInt(hex.length % 2 ? l + l : l, 16) / 255)
)}

function _twgl(require){return(
require("twgl.js")
)}

function _44(md){return(
md`---
## Knowledge gained so far
By now you should:
- have created an Observable account and be comfortable with its environment and notebooks,
- understand the minor coding difference of Javascript when used in Observable,
- be able to load inline data and local and remote files in your notebook
- be able to import Javascript libraries.
`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("viewof scale")).define("viewof scale", ["Inputs"], _scale);
  main.variable(observer("scale")).define("scale", ["Generators", "viewof scale"], (G, _) => G.input(_));
  main.variable(observer("viewof color")).define("viewof color", ["colorInput"], _color);
  main.variable(observer("color")).define("color", ["Generators", "viewof color"], (G, _) => G.input(_));
  main.variable(observer()).define(["DOM","width","hex2rgb","color","twgl","scale"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["html"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["md"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["x"], _19);
  main.variable(observer("x")).define("x", _x);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer()).define(_22);
  main.variable(observer()).define(["md"], _23);
  main.variable(observer()).define(_24);
  main.variable(observer()).define(["md"], _25);
  main.variable(observer("data")).define("data", _data);
  main.variable(observer()).define(["md"], _27);
  main.variable(observer("printProgram")).define("printProgram", _printProgram);
  main.variable(observer()).define(["printProgram"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["md"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("teapotObjData")).define("teapotObjData", ["soFetch"], _teapotObjData);
  main.variable(observer()).define(["md"], _35);
  main.variable(observer("downloads")).define("downloads", ["md"], _downloads);
  main.variable(observer()).define(["md"], _37);
  main.variable(observer()).define(["DOM","data"], _38);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer("hex2rgb")).define("hex2rgb", _hex2rgb);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  const child1 = runtime.module(define1);
  main.import("color", "colorInput", child1);
  const child2 = runtime.module(define2);
  main.import("soFetch", child2);
  main.variable(observer()).define(["md"], _44);
  return main;
}
