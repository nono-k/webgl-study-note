import { Camera, Geometry, Mesh, Program, Render, Scene } from '@/lib/webgl';

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

  const positions = new Float32Array([0.0, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0]);
  const uvs = new Float32Array([0, 0, 1, 0, 0, 1]);
  const indices = new Uint16Array([0, 1, 2]);

  const geometry = new Geometry(gl, {
    position: { size: 3, data: positions },
    uv: { size: 2, data: uvs },
    index: { size: 1, data: indices },
  });

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
    },
  });

  const triangle1 = new Mesh(gl, { geometry, program });
  triangle1.position.x = -0.5;
  triangle1.position.y = -0.5;
  scene.add(triangle1);

  const triangle2 = new Mesh(gl, { geometry, program });
  triangle2.position.x = 0.5;
  triangle2.position.y = -0.5;
  scene.add(triangle2);

  const triangle3 = new Mesh(gl, { geometry, program });
  triangle3.position.y = 0.5;
  scene.add(triangle3);

  const update = () => {
    render.render({ scene, camera });

    // requestAnimationFrame(update);
  };

  update();

  const resize = () => {
    render.setSize(window.innerWidth, window.innerHeight);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  };
  window.addEventListener('resize', resize);
};
