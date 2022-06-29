// https://observablehq.com/@spattana/model-loaders-using-threejs@422
function _1(md,ModelSupported){return(
md`# Model Loaders using [ThreeJS](https://threejs.org/)
Uses ThreeJs Loader to create SC models for twgl. 
Currently Supports ${Object.keys(ModelSupported).join(", ")} models loading.  
You may try other types of files similarly.  
Models sources:
rayman_2_mdl.ob: from [ModelResource](https://www.models-resource.com/dreamcast/rayman2thegreatescape/model/17577/),  
Flamingo.glb: flamingo by [mirada](http://mirada.com/) via downloaded from [ThreeJS](https://github.com/mrdoob/three.js/tree/master/examples/models/gltf).  
Elf girl model from [ThreeJS](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/collada/elf/elf.dae) originally from [Sketchfab](https://sketchfab.com/3d-models/elf-girl-52f2e84961b94760b7805c178890d644)`
)}

function _loadModelFromURL(ModelSupported,createSCs){return(
async (url, modelformat) => {
  if (!modelformat) return "Missing model format parameter";
  const loader = ModelSupported[modelformat.toLowerCase()];
  if (!loader) return "Model not supported";
  let loadedModel = await loader(url);
  return createSCs(loadedModel);
}
)}

function _3(md){return(
md`Usage:  
*import {loadModelFromURL} from "@spattana/model-loaders-using-threejs"  *
*loadModelFromURL(model_URL_name, model_type)*  
Any model URL can be fetched in Javascript via *fetch URL_name* can be used. If it can not be fetched then you may download the model to your local folder and attach it to your notebook page. 
Once attached you may use statement *FileAttachment(attached_filename).url()* to get the local URL for the attached file and use.
model_type can be: "collada", "obj", "stl", "gltf", or "tds" 
`
)}

function _4(md){return(
md`Example:`
)}

function _5(loadModelFromURL,rayman_url){return(
loadModelFromURL(rayman_url, "obj")
)}

function _6(md){return(
md`### Example`
)}

function _cameraSCs(createSCs,cameraObject){return(
createSCs(cameraObject)
)}

function _cameraObject(loadObjObject,camera_url){return(
loadObjObject(camera_url)
)}

async function _camera_url(FileAttachment){return(
await FileAttachment("video_camera.obj").url()
)}

function _flamingoObject(loadGLTFobject,Flamingo_url){return(
loadGLTFobject(Flamingo_url)
)}

async function _Flamingo_url(FileAttachment){return(
await FileAttachment("Flamingo.glb").url()
)}

function _raymanSCs(createSCs,raymanObject){return(
createSCs(raymanObject)
)}

function _raymanObject(loadObjObject,rayman_url){return(
loadObjObject(rayman_url)
)}

async function _rayman_url(FileAttachment){return(
await FileAttachment("rayman_2_mdl.obj").url()
)}

function _elfSCs(createSCs,elfObject){return(
createSCs(elfObject )
)}

function _elfObject(loadCOLLADAobject,elf_url){return(
loadCOLLADAobject(elf_url)
)}

function _elf_url(){return(
"https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/collada/elf/elf.dae"
)}

function _arterySCs(createSCs,arteryObject){return(
createSCs(arteryObject)
)}

function _arteryObject(loadSTLobject,artery_url){return(
loadSTLobject(artery_url)
)}

async function _artery_url(FileAttachment){return(
await FileAttachment("artery-model2.stl").url()
)}

function _21(md){return(
md`### Useful functions`
)}

function _loadTDSObject(loadObject,THREE){return(
(url)=> loadObject(url, new THREE.TDSLoader())
)}

function _loadObjObject(loadObject,THREE){return(
(url, mtls) => loadObject(url, new THREE.OBJLoader(), mtls)
)}

async function _mtls(loadMaterial,FileAttachment){return(
loadMaterial(await FileAttachment("rayman_2_mdl.mtl").url())
)}

async function _25(loadObjObject,FileAttachment){return(
loadObjObject(await FileAttachment("rayman_2_mdl.obj").url())
)}

function _loadMaterial(THREE){return(
(url) => {
  const mtlLoader = new THREE.MTLLoader();
  return new Promise((resolve, reject) => {
    // instantiate a loader
    mtlLoader.load(
      // resource URL
      url,
      resolve
      // called when resource is loaded
      /*
      function (mtls) {
        mtls.preload();
        resolve(mtls);
      }
      */
    );
  });
}
)}

function _loadCOLLADAobject(loadObject,THREE){return(
(url)=> loadObject(url, new THREE.ColladaLoader())
)}

function _loadSTLobject(loadObject,THREE){return(
(url)=> loadObject(url, new THREE.STLLoader())
)}

function _loadGLTFobject(loadObject,THREE){return(
(url)=> loadObject(url, new THREE.GLTFLoader())
)}

function _ModelSupported(loadCOLLADAobject,loadObjObject,loadSTLobject,loadGLTFobject,loadTDSObject){return(
{
  collada: loadCOLLADAobject,
  obj: loadObjObject,
  stl: loadSTLobject,
  gltf: loadGLTFobject,
  tds: loadTDSObject
}
)}

function _computeMatrix(mat4){return(
(node) => {
  const translation = node.position
    ? [node.position.x, node.position.y, node.position.z]
    : [0, 0, 0];
  const quaternion = node.quaternion
    ? [
        node.quaternion.x,
        node.quaternion.y,
        node.quaternion.z,
        node.quaternion.w
      ]
    : [0, 0, 0, 1];
  //const rotation = node.rotation?[node.rotation.x,node.rotation.y,node.rotation.z]:[0,0,0];// XYZ order
  const scale = node.scale.x
    ? [node.scale.x, node.scale.y, node.scale.z]
    : [1, 1, 1];
  //return node.scale.x
  return mat4.fromRotationTranslationScale(quaternion, translation, scale);
}
)}

function _createSCs(mat4,d3,createSC){return(
(obj) => {
  const sceneGraph = {};
  let scs = [];
  if (obj.scene) getNode(obj.scene, mat4.create());
  else getNode(obj, mat4.create());

  function getNode(node, M) {
    const sc = {};
    sc.name = node.name;

    const translation = node.position
      ? [node.position.x, node.position.y, node.position.z]
      : [0, 0, 0];
    const quaternion = node.quaternion
      ? [
          node.quaternion.x,
          node.quaternion.y,
          node.quaternion.z,
          node.quaternion.w
        ]
      : [0, 0, 0, 1];
    //const rotation = node.rotation?[node.rotation.x,node.rotation.y,node.rotation.z]:[0,0,0];// XYZ order
    const scale =
      node.scale && node.scale.x
        ? [node.scale.x, node.scale.y, node.scale.z]
        : [1, 1, 1];

    sc.modelMatrix = mat4.multiply(
      M,
      mat4.fromRotationTranslationScale(quaternion, translation, scale)
    );

    if (node.geometry || node.attributes) {
      const attributes = node.geometry
        ? node.geometry.attributes
        : node.attributes;
      if (
        node.geometry &&
        node.geometry.groups &&
        node.geometry.groups.length > 0
      ) {
        const groups = node.geometry.groups;
        const localScs = d3.range(0, groups.length, 1).map((i) => {
          /*
          return{
            positions : array2Darray(attributes.position.array.slice(groups[i].start*3, (groups[i].start+groups[i].count)*3),3),
            normals : array2Darray(attributes.normal.array.slice(groups[i].start*3, (groups[i].start+groups[i].count)*3),3),
            uvs : array2Darray(attributes.uv.array.slice(groups[i].start*2, (groups[i].start+groups[i].count)*2),2)
          }
          */
          return createSC(attributes, {
            start: groups[i].start,
            count: groups[i].count
          });
        });
        //return scs
        localScs.forEach((d, i) => {
          //d.cells = d3.range(0,d.positions.length/3,1).map(i=>[i*3+0,i*3+1,i*3+2]);
          scs.push({ name: sc.name, sc: d, modelMatrix: sc.modelMatrix });
        });
      } else {
        sc.sc = createSC(attributes);
        scs.push(sc);
      }
    }
    if (node.children) node.children.forEach((d) => getNode(d, sc.modelMatrix));
  }
  return scs;
}
)}

function _createSC(vec3){return(
(attributes, offset) => {
  let positions = offset
    ? attributes.position.array.slice(
        offset.start * 3,
        (offset.start + offset.count) * 3
      )
    : attributes.position.array.slice();
  let normals = undefined,
    uvs = undefined;
  if (attributes.normal)
    normals = offset
      ? attributes.normal.array.slice(
          offset.start * 3,
          (offset.start + offset.count) * 3
        )
      : attributes.normal.array.slice();
  else {
    let count = positions.length / 3;
    let Ns = [];
    for (let i = 0; i < offset.count; i += 3) {
      const k = offset.start + i;
      const v0 = positions.slice(k * 9, k * 9 + 3),
        v1 = positions.slice(k * 9 + 3, k * 9 + 6),
        v2 = positions.slice(k * 9 + 6, k * 9 + 9);
      const N = Array.from(
        vec3.normalize(vec3.cross(vec3.subtract(v1, v0), vec3.subtract(v2, v0)))
      );
      Ns.push(N, N, N);
    }
    normals = Ns.flat();
  }
  if (attributes.uv)
    uvs = offset
      ? attributes.uv.array.slice(
          offset.start * 2,
          (offset.start + offset.count) * 2
        )
      : attributes.uv.array.slice();
  return {
    positions,
    normals,
    uvs
  };
}
)}

function _loadObject(){return(
(url, loader,mtls) =>
  new Promise((resolve, reject) => {
    // instantiate a loader
    if (mtls)loader.setMaterials(mtls);
    loader.load(
      // resource URL
      url,
      // called when resource is loaded
      function (object) {
        resolve(object);
      },
      // called when loading is in progresses
      function (xhr) {
        return (xhr.loaded / xhr.total) * 100 + "% loaded";
      },
      // called when loading has errors
      function (error) {
        reject("Error in loading");
      }
    );
  })
)}

function _test(computeModelExtent,raymanSCs){return(
computeModelExtent(raymanSCs)
)}

function _computeModelExtent(d3,mat4,vec3){return(
function (o) {
  const extents = o.map((d) => {
    const xExtent = d3.extent(d.sc.positions.filter((_, i) => i % 3 === 0));
    const yExtent = d3.extent(d.sc.positions.filter((_, i) => i % 3 === 1));
    const zExtent = d3.extent(d.sc.positions.filter((_, i) => i % 3 === 2));
    return {
      min: [xExtent[0], yExtent[0], zExtent[0]],
      max: [xExtent[1], yExtent[1], zExtent[1]]
    };
  });

  const transformedExtents = extents.map((extent, i) => {
    return o[i].modelMatrix
      ? {
          min: mat4.transformPoint(o[i].modelMatrix, extent.min),
          max: mat4.transformPoint(o[i].modelMatrix, extent.max)
        }
      : extent;
  });
  const xMin = d3.min(transformedExtents, (d) => d.min[0]);
  const xMax = d3.max(transformedExtents, (d) => d.max[0]);
  const yMin = d3.min(transformedExtents, (d) => d.min[1]);
  const yMax = d3.max(transformedExtents, (d) => d.max[1]);
  const zMin = d3.min(transformedExtents, (d) => d.min[2]);
  const zMax = d3.max(transformedExtents, (d) => d.max[2]);
  const min = [xMin, yMin, zMin],
    max = [xMax, yMax, zMax];
  const center = vec3.divScalar(vec3.add(min, max), 2); // center of AABB
  const dia = vec3.length(vec3.subtract(max, min)); // Diagonal length of the AABB
  return {
    min,
    max,
    center,
    dia
  };
}
)}

function _38(md){return(
md `### Libraries and Imports`
)}

function _mat4(twgl)
{
  const M4 = twgl.m4;
  M4.create = () =>
    new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  M4.fromQuat = (q) => {
    let x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let yx = y * x2;
    let yy = y * y2;
    let zx = z * x2;
    let zy = z * y2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    let out = [];
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = out[13] = out[14] = 0;
    out[15] = 1;
    return out;
  };
  M4.fromRotationTranslationScale = (q, v, s) => {
    // Quaternion math
    let x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    let sx = s[0];
    let sy = s[1];
    let sz = s[2];
    let out = [];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  };
  return M4;
}


function _vec3(twgl){return(
twgl.v3
)}

function _twgl(require){return(
require("twgl.js")
)}

async function _THREE(require)
{
  const THREE = (window.THREE = await require("three"));
  await require("three/examples/js/loaders/ColladaLoader.js").catch(() => {});
  await require("three/examples/js/loaders/OBJLoader.js").catch(() => {});
  await require("three/examples/js/loaders/STLLoader.js").catch(() => {});
  await require("three/examples/js/loaders/GLTFLoader.js").catch(() => {});
  await require("three/examples/js/loaders/TDSLoader.js").catch(() => {});
  await require("three/examples/js/loaders/MTLLoader.js").catch(() => {});
  return THREE;
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["artery-model2.stl", {url: new URL("./files/0bbcf255d498f0b442f986ebe9468fcffd3ebd0d6ec590bcf456ec80bbe8b175bfe74088e693a8cbdec9ed732fd49fa7bf95c01558e762719bfd9838f597f85e.stl", import.meta.url), mimeType: "model/stl", toString}],
    ["Flamingo.glb", {url: new URL("./files/3781d7389142db9c5242a3c3e1bc3ea31304e19429d9f751dba1f5ce572240c66063141a8f6ca081a2e985862470e98d9ca1013773f8ff1c344987127370958a.glb", import.meta.url), mimeType: "model/gltf-binary", toString}],
    ["rayman_2_mdl.obj", {url: new URL("./files/c1fc0d2fbf2bed5669afae79d4c0e896701b9e7257924c92a873b376bb2e65d7c217aeb899c11088d648cf89535a89089cdabff9da336ba7e6a739dd5e20a5cf.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["video_camera.obj", {url: new URL("./files/0a7b63f1155a1d788eac2a32351d3cd594521765918479a9bf243d77858add5752c961ef0fa7c39943249521d49985e593060d7dcf7a3b458da1ad22aadfd4f8.bin", import.meta.url), mimeType: "application/octet-stream", toString}],
    ["rayman_2_mdl.mtl", {url: new URL("./files/2944ae487c1430b6aa2563bebce22180d8a89a242057d0174d18951609187263f4a3df9c5f56cc9b58b5f493c13e703d22b10fb7ef7c0e4a6b1177b3bbd4b083.bin", import.meta.url), mimeType: "application/octet-stream", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md","ModelSupported"], _1);
  main.variable(observer("loadModelFromURL")).define("loadModelFromURL", ["ModelSupported","createSCs"], _loadModelFromURL);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["loadModelFromURL","rayman_url"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("cameraSCs")).define("cameraSCs", ["createSCs","cameraObject"], _cameraSCs);
  main.variable(observer("cameraObject")).define("cameraObject", ["loadObjObject","camera_url"], _cameraObject);
  main.variable(observer("camera_url")).define("camera_url", ["FileAttachment"], _camera_url);
  main.variable(observer("flamingoObject")).define("flamingoObject", ["loadGLTFobject","Flamingo_url"], _flamingoObject);
  main.variable(observer("Flamingo_url")).define("Flamingo_url", ["FileAttachment"], _Flamingo_url);
  main.variable(observer("raymanSCs")).define("raymanSCs", ["createSCs","raymanObject"], _raymanSCs);
  main.variable(observer("raymanObject")).define("raymanObject", ["loadObjObject","rayman_url"], _raymanObject);
  main.variable(observer("rayman_url")).define("rayman_url", ["FileAttachment"], _rayman_url);
  main.variable(observer("elfSCs")).define("elfSCs", ["createSCs","elfObject"], _elfSCs);
  main.variable(observer("elfObject")).define("elfObject", ["loadCOLLADAobject","elf_url"], _elfObject);
  main.variable(observer("elf_url")).define("elf_url", _elf_url);
  main.variable(observer("arterySCs")).define("arterySCs", ["createSCs","arteryObject"], _arterySCs);
  main.variable(observer("arteryObject")).define("arteryObject", ["loadSTLobject","artery_url"], _arteryObject);
  main.variable(observer("artery_url")).define("artery_url", ["FileAttachment"], _artery_url);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("loadTDSObject")).define("loadTDSObject", ["loadObject","THREE"], _loadTDSObject);
  main.variable(observer("loadObjObject")).define("loadObjObject", ["loadObject","THREE"], _loadObjObject);
  main.variable(observer("mtls")).define("mtls", ["loadMaterial","FileAttachment"], _mtls);
  main.variable(observer()).define(["loadObjObject","FileAttachment"], _25);
  main.variable(observer("loadMaterial")).define("loadMaterial", ["THREE"], _loadMaterial);
  main.variable(observer("loadCOLLADAobject")).define("loadCOLLADAobject", ["loadObject","THREE"], _loadCOLLADAobject);
  main.variable(observer("loadSTLobject")).define("loadSTLobject", ["loadObject","THREE"], _loadSTLobject);
  main.variable(observer("loadGLTFobject")).define("loadGLTFobject", ["loadObject","THREE"], _loadGLTFobject);
  main.variable(observer("ModelSupported")).define("ModelSupported", ["loadCOLLADAobject","loadObjObject","loadSTLobject","loadGLTFobject","loadTDSObject"], _ModelSupported);
  main.variable(observer("computeMatrix")).define("computeMatrix", ["mat4"], _computeMatrix);
  main.variable(observer("createSCs")).define("createSCs", ["mat4","d3","createSC"], _createSCs);
  main.variable(observer("createSC")).define("createSC", ["vec3"], _createSC);
  main.variable(observer("loadObject")).define("loadObject", _loadObject);
  main.variable(observer("test")).define("test", ["computeModelExtent","raymanSCs"], _test);
  main.variable(observer("computeModelExtent")).define("computeModelExtent", ["d3","mat4","vec3"], _computeModelExtent);
  main.variable(observer()).define(["md"], _38);
  main.variable(observer("mat4")).define("mat4", ["twgl"], _mat4);
  main.variable(observer("vec3")).define("vec3", ["twgl"], _vec3);
  main.variable(observer("twgl")).define("twgl", ["require"], _twgl);
  main.variable(observer("THREE")).define("THREE", ["require"], _THREE);
  return main;
}
