import nx from '@/assets/images/environment/Maskonaive/negx.jpg';
import ny from '@/assets/images/environment/Maskonaive/negy.jpg';
import nz from '@/assets/images/environment/Maskonaive/negz.jpg';
import px from '@/assets/images/environment/Maskonaive/posx.jpg';
import py from '@/assets/images/environment/Maskonaive/posy.jpg';
import pz from '@/assets/images/environment/Maskonaive/posz.jpg';
import { Box, Camera, CubeTexture, Mesh, Orbit, Program, Render, Scene, Sphere } from '@/lib/webgl';

import boxFragment from './box.frag?raw';
import boxVertex from './box.vert?raw';

import sphereFragment from './sphere.frag?raw';
import sphereVertex from './sphere.vert?raw';

export const onload = () => {
  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  const render = new Render(canvas);
  render.fitScreen();
  const gl = render.gl;
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 });
  camera.position.set(-2, 1, -3);
  camera.lookAt([0, 0, 0]);

  const controls = new Orbit(camera);

  const scene = new Scene();

  const environmentTexture = new CubeTexture(gl, {
    px: px.src,
    nx: nx.src,
    py: py.src,
    ny: ny.src,
    pz: pz.src,
    nz: nz.src,
  });

  const boxGeometry = new Box(gl);

  const boxProgram = new Program(gl, {
    vertex: boxVertex,
    fragment: boxFragment,
    uniforms: {
      uEnviroment: { value: environmentTexture },
    },
  });

  const box = new Mesh(gl, {
    geometry: boxGeometry,
    program: boxProgram,
  });

  box.scale.set(20);
  scene.add(box);

  const sphereGeometry = new Sphere(gl, {
    widthSegments: 32,
    heightSegments: 32,
  });

  const sphereProgram = new Program(gl, {
    vertex: sphereVertex,
    fragment: sphereFragment,
    uniforms: {
      uEnviroment: { value: environmentTexture },
    },
  });

  const sphere = new Mesh(gl, {
    geometry: sphereGeometry,
    program: sphereProgram,
  });

  sphere.scale.set(2);
  scene.add(sphere);

  const update = () => {
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
