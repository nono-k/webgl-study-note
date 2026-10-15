import sky from '@/assets/images/sky.jpg';
import { Camera, Mesh, Orbit, Program, Render, Scene, Sphere, Texture } from '@/lib/webgl';
import sphereFragment from './sphere.frag?raw';
import sphereVertex from './sphere.vert?raw';

export const onload = () => {
  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  const render = new Render(canvas);
  render.fitScreen();
  const gl = render.gl;
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  const camera = new Camera(gl, { fov: 45 });
  camera.position.set(0, 0, 0.01);

  const controls = new Orbit(camera);

  const scene = new Scene();

  const sphereGeometry = new Sphere(gl, {
    widthSegments: 32,
    heightSegments: 32,
  });

  const imageTexture = new Texture(gl, sky.src);

  const sphereProgram = new Program(gl, {
    vertex: sphereVertex,
    fragment: sphereFragment,
    uniforms: {
      uTexture: { value: imageTexture },
    },
  });

  const sphere = new Mesh(gl, {
    geometry: sphereGeometry,
    program: sphereProgram,
  });

  sphere.scale.set(10);
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
