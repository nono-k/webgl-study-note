import { Gui } from '@/lib/Gui/Gui';
import { Geometry, Mesh, Program, Render, Scene, Texture } from '@/lib/webgl';

import fragment from './index.frag?raw';
import vertex from './index.vert?raw';

import image01 from '@/assets/images/autumn.jpg';
// import image01 from '@/assets/images/image01.jpg';
import image02 from '@/assets/images/spring.jpg';
import image03 from '@/assets/images/summer.jpg';
import image04 from '@/assets/images/winter.jpg';

export const onload = () => {
  const images = [
    { text: 'autumn', value: image01 },
    { text: 'spring', value: image02 },
    { text: 'summer', value: image03 },
    { text: 'winter', value: image04 },
  ];
  const textures: Texture[] = [];

  const canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
  const render = new Render(canvas);
  render.fitScreen();
  const gl = render.gl;
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const scene = new Scene();

  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]);
  const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

  const plane = new Geometry(gl, {
    position: { size: 3, data: positions },
    uv: { size: 2, data: uvs },
    index: { size: 1, data: indices },
  });

  let texture: Texture;

  for (const image of images) {
    texture = new Texture(gl, image.value.src);
    textures.push(texture);
  }

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTexture: { value: textures[0] },
      uResolution: { value: [canvas.width, canvas.height] },
      k: { value: 2, type: 'init' },
    },
  });

  const mesh = new Mesh(gl, { geometry: plane, program });

  scene.add(mesh);

  const update = () => {
    render.render({ scene });

    requestAnimationFrame(update);
  };

  update();

  const resize = () => {
    render.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', resize);

  const k = program.uniforms.k;

  const PARAMS = {
    k: k.value,
  };

  // biome-ignore format: este array no debe ser formateado
  const pane = new Gui();
  pane.addBinding(PARAMS, 'k', { min: 1, max: 4, step: 1 });
  pane.addSelectedImage(images);
  pane.addSaveBtn(render, scene);

  pane.on('change', e => {
    k.value = PARAMS.k;

    const selectedImage = images.findIndex(image => image.value.src === e.value);
    if (selectedImage !== -1) {
      program.uniforms.uTexture.value = textures[selectedImage];
    }
  });
};
