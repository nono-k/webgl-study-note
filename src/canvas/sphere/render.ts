import { Gui } from '@/lib/Gui/Gui';
import { Camera, Mesh, Orbit, Program, Render, Scene, Sphere } from '@/lib/webgl';

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

  const controls = new Orbit(camera);

  const scene = new Scene();

  const PARAMS = {
    wireframe: false,
    radius: 0.5,
    widthSegments: 24,
    heightSegments: Math.ceil(24 * 0.5),
    phiStart: 0,
    phiLength: Math.PI * 2,
    thetaStart: 0,
    thetaLength: Math.PI,
  };

  const sphereGeometry = new Sphere(gl, PARAMS);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
    },
  });

  const sphere = new Mesh(gl, { geometry: sphereGeometry, program });
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

  const updateGeometry = () => {
    sphere.geometry = new Sphere(gl, PARAMS);
  };

  const pane = new Gui();

  pane.addBinding(PARAMS, 'wireframe');
  pane.addBinding(PARAMS, 'radius', { min: 0.1, max: 1 });
  pane.addBinding(PARAMS, 'widthSegments', { min: 1, max: 32, step: 1 });
  pane.addBinding(PARAMS, 'heightSegments', { min: 1, max: 32, step: 1 });
  pane.addBinding(PARAMS, 'phiStart', { min: 0, max: Math.PI * 2 });
  pane.addBinding(PARAMS, 'phiLength', { min: 0, max: Math.PI * 2 });
  pane.addBinding(PARAMS, 'thetaStart', { min: 0, max: Math.PI });
  pane.addBinding(PARAMS, 'thetaLength', { min: 0, max: Math.PI });

  pane.on('change', updateGeometry);
};
