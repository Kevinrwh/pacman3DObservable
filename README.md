# Pacman 3D Game

About:
A 3D pacman game with custom graphics built using twgl/Observable.
## Video Example
[Download Here](https://github.com/Kevinrwh/pacman3DObservable/blob/main/pacman_presentation.mp4)

## Instructions
Wanna play? Read instructions below.
To contact: E-mail Kevinrwh28@gmail.com

Play in Observable: https://observablehq.com/d/af339eefbff6b482@4045

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
npx http-server
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@4
npm install https://api.observablehq.com/d/af339eefbff6b482@4045.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "af339eefbff6b482";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~
