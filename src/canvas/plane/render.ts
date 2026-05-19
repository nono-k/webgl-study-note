import { Gui } from '@/lib/Gui/Gui';
import { Camera, Mesh, Plane, Program, Render, Scene } from '@/lib/webgl';

import fragment from './index.frag?raw';
import vertex from './index.vert?raw';

export const onload = () => {
  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  const render = new Render(canvas);
  render.fitScreen();
  const gl = render.gl;
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  const camera = new Camera(gl, { fov: 45, near: 0.1, far: 100 });
  camera.position.z = 3;

  const scene = new Scene();

  const PARAMS = {
    // wireframe: false,
    wireframe: true,
    width: 1,
    height: 1,
    widthSegments: 1,
    heightSegments: 1,
  };

  const planeGeometry = new Plane(gl, PARAMS);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
    },
  });

  const plane = new Mesh(gl, { geometry: planeGeometry, program });
  scene.add(plane);

  const update = () => {
    render.render({ scene, camera });

    requestAnimationFrame(update);
  };

  update();

  const resize = () => {
    render.setSize(window.innerWidth, window.innerHeight);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  };
  window.addEventListener('resize', resize);
  resize();

  const updateGeometry = () => {
    plane.geometry = new Plane(gl, PARAMS);
  };

  const pane = new Gui();

  pane.addBinding(PARAMS, 'wireframe');
  pane.addBinding(PARAMS, 'width', { min: 0.1, max: 5 });
  pane.addBinding(PARAMS, 'height', { min: 0.1, max: 5 });

  pane.on('change', updateGeometry);
};
