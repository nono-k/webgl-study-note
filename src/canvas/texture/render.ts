import image from '@/assets/images/autumn.jpg';
import video from '@/assets/video/video-01.mp4';
import { Box, Camera, Mesh, Orbit, Plane, Program, Render, Scene, Texture } from '@/lib/webgl';
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
  camera.position.set(1, 1, 4);
  camera.lookAt([0, 0, 0]);

  const controls = new Orbit(camera);

  const scene = new Scene();

  const planeGeometry = new Plane(gl, { width: 3, height: 2 });
  const imageTexture = new Texture(gl, image.src);

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTexture: { value: imageTexture },
    },
  });

  const plane = new Mesh(gl, { geometry: planeGeometry, program });
  plane.position.set(-2, 0, 0);
  scene.add(plane);

  const boxGeometry = new Box(gl, { width: 1.5, height: 1.5, depth: 1.5 });

  const videoElement = document.createElement('video') as HTMLVideoElement;
  videoElement.src = video;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.setAttribute('playsinline', 'playsinline');
  videoElement.play();

  const videoTexture = new Texture(gl, videoElement);

  const videoProgram = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTexture: { value: videoTexture },
      uTime: { value: 0 },
    },
  });

  const box = new Mesh(gl, { geometry: boxGeometry, program: videoProgram });
  box.rotation.set(-Math.PI / 4, Math.PI / 4, 0);
  box.position.set(1.5, 0, -2);
  scene.add(box);

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
