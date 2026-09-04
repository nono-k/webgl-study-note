import {
  AxesHelper,
  Box,
  Camera,
  FaceNormalsHelper,
  GridHelper,
  Mesh,
  Orbit,
  Plane,
  Program,
  Render,
  Scene,
  Sphere,
  VertexNormalsHelper,
} from '@/lib/webgl';

import fragment from './index.frag?raw';
import vertex from './index.vert?raw';

export const onload = () => {
  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  const render = new Render(canvas);
  render.fitScreen();
  const gl = render.gl;
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 });
  camera.position.set(1, 1, 7);
  camera.lookAt([0, 0, 0]);

  const controls = new Orbit(camera);

  const scene = new Scene();

  const PARAMS = {
    wireframe: false,
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1,
  };

  const grid = new GridHelper(gl);
  scene.add(grid);

  const axes = new AxesHelper(gl, { size: 6, symmetric: true });
  scene.add(axes);

  const planeGeometry = new Plane(gl, PARAMS);
  const boxGeometry = new Box(gl, PARAMS);
  const sphereGeometry = new Sphere(gl);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
    },
  });

  const plane = new Mesh(gl, { geometry: planeGeometry, program });
  scene.add(plane);

  const planeVertexNormals = new VertexNormalsHelper(plane);
  scene.add(planeVertexNormals);

  const planeFaceNormals = new FaceNormalsHelper(plane);
  scene.add(planeFaceNormals);

  const box = new Mesh(gl, { geometry: boxGeometry, program });
  box.position.set(1.5, 1.5, 0.0);
  scene.add(box);

  const boxVertexNormals = new VertexNormalsHelper(box);
  scene.add(boxVertexNormals);

  const boxFaceNormals = new FaceNormalsHelper(box);
  scene.add(boxFaceNormals);

  const sphere = new Mesh(gl, { geometry: sphereGeometry, program });
  sphere.position.set(-1.5, 1.5, 0.0);
  scene.add(sphere);

  const sphereVertexNormals = new VertexNormalsHelper(sphere);
  scene.add(sphereVertexNormals);

  const sphereFaceNormals = new FaceNormalsHelper(sphere);
  scene.add(sphereFaceNormals);

  const update = () => {
    box.rotation.y += 0.005;
    box.rotation.x += 0.005;
    render.render({ scene, camera });

    controls.update();

    requestAnimationFrame(update);
  };

  update();

  const resize = () => {
    render.setSize(window.innerWidth, window.innerHeight);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  };
  window.addEventListener('resize', resize);
  resize();
};
