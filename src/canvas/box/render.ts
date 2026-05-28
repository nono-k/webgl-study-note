import { Gui } from '@/lib/Gui/Gui';
import { Box, Camera, Mesh, Program, Render, Scene } from '@/lib/webgl';

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
  camera.position.z = 3;

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

  const boxGeometry = new Box(gl, PARAMS);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
    },
  });

  const box = new Mesh(gl, { geometry: boxGeometry, program });
  box.rotation.set(-Math.PI / 4, Math.PI / 4, 0);
  scene.add(box);

  const update = () => {
    // box.rotation.y += 0.005;
    // box.rotation.x += 0.005;
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
    box.geometry = new Box(gl, PARAMS);
  };

  const pane = new Gui();

  pane.addBinding(PARAMS, 'wireframe');
  pane.addBinding(PARAMS, 'width', { min: 0.1, max: 5 });
  pane.addBinding(PARAMS, 'height', { min: 0.1, max: 5 });
  pane.addBinding(PARAMS, 'depth', { min: 0.1, max: 5 });
  pane.addBinding(PARAMS, 'widthSegments', { min: 1, max: 20, step: 1 });
  pane.addBinding(PARAMS, 'heightSegments', { min: 1, max: 20, step: 1 });
  pane.addBinding(PARAMS, 'depthSegments', { min: 1, max: 20, step: 1 });
  pane.on('change', updateGeometry);
};
