import { Gui } from '@/lib/Gui/Gui';
import { Geometry, Mesh, Program, Render, Scene, Texture } from '@/lib/webgl';

import fragment from './index.frag?raw';
import vertex from './index.vert?raw';

import image01 from '@/assets/images/autumn.jpg';
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
      isHorizon: { value: true },
      wavelength: { value: 0.05 },
      amplitude: { value: 0.5 },
      lightDirectionX: { value: -1.0 },
      lightDirectionY: { value: -1.0 },
      ambient: { value: 0.3 },
      isRefraction: { value: false },
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

  const wavelength = program.uniforms.wavelength;
  const amplitude = program.uniforms.amplitude;
  const lightDirectionX = program.uniforms.lightDirectionX;
  const lightDirectionY = program.uniforms.lightDirectionY;
  const ambient = program.uniforms.ambient;
  const isRefraction = program.uniforms.isRefraction;

  const PARAMS = {
    wavelength: wavelength.value,
    amplitude: amplitude.value,
    lightDirectionX: lightDirectionX.value,
    lightDirectionY: lightDirectionY.value,
    ambient: ambient.value,
    isRefraction: isRefraction.value,
  };

  const direction = [
    { text: 'horizontal', value: true },
    { text: 'vertical', value: false },
  ];

  // biome-ignore format: este array no debe ser formateado
  const pane = new Gui();
  pane.addBlade({
    view: 'list',
    label: 'direction',
    options: direction.map(d => ({
      text: d.text,
      value: d.value,
    })),
    value: direction[0].value,
  });
  pane.addBinding(PARAMS, 'wavelength', { min: 0.0, max: 0.1, step: 0.001 });
  pane.addBinding(PARAMS, 'amplitude', { min: 0.01, max: 1.0, step: 0.001 });
  pane.addBinding(PARAMS, 'lightDirectionX', { min: -1.0, max: 1.0, step: 0.01 });
  pane.addBinding(PARAMS, 'lightDirectionY', { min: -1.0, max: 1.0, step: 0.01 });
  pane.addBinding(PARAMS, 'ambient', { min: 0.0, max: 2.0, step: 0.01 });
  pane.addBinding(PARAMS, 'isRefraction', { label: '屈折' });
  pane.addSelectedImage(images);
  pane.addSaveBtn(render, scene);

  pane.on('change', e => {
    wavelength.value = PARAMS.wavelength;
    amplitude.value = PARAMS.amplitude;
    lightDirectionX.value = PARAMS.lightDirectionX;
    lightDirectionY.value = PARAMS.lightDirectionY;
    ambient.value = PARAMS.ambient;
    isRefraction.value = PARAMS.isRefraction;

    if (e.target.label === 'direction') {
      const selectedDirection = direction.find(d => d.value === e.value);
      if (selectedDirection) {
        program.uniforms.isHorizon.value = selectedDirection.value;
      }
    }

    const selectedImage = images.findIndex(image => image.value.src === e.value);
    if (selectedImage !== -1) {
      program.uniforms.uTexture.value = textures[selectedImage];
    }
  });
};
