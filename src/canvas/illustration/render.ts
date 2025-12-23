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
    { text: 'spring', value: image02 },
    { text: 'summer', value: image03 },
    { text: 'autumn', value: image01 },
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
      select: { value: 0, type: 'init' },
      level: { value: 5.0 },
      stroke: { value: 0.5 },
      strokeColor: { value: [0.0, 0.0, 0.0] },
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

  const level = program.uniforms.level;
  const stroke = program.uniforms.stroke;
  const strokeColor = program.uniforms.strokeColor;

  const PARAMS = {
    level: level.value,
    stroke: stroke.value,
    strokeColor: { r: strokeColor.value[0], g: strokeColor.value[1], b: strokeColor.value[2] },
  };

  const selects = [
    { text: 'イラスト調', value: 0 },
    { text: 'ポスタリゼーションのみ', value: 1 },
    { text: 'エッジのみ', value: 2 },
  ];

  const select = program.uniforms.select;

  // biome-ignore format: este array no debe ser formateado
  const pane = new Gui();
  pane.addBlade({
    view: 'list',
    label: 'select',
    options: selects,
    value: select.value,
  });
  pane.addBinding(PARAMS, 'level', { min: 1, max: 15, step: 0.01 });
  pane.addBinding(PARAMS, 'stroke', { min: 0, max: 1, step: 0.01 });
  pane.addBinding(PARAMS, 'strokeColor');
  pane.addSelectedImage(images);
  pane.addSaveBtn(render, scene);

  pane.on('change', e => {
    level.value = PARAMS.level;
    stroke.value = PARAMS.stroke;
    strokeColor.value = [PARAMS.strokeColor.r / 255, PARAMS.strokeColor.g / 255, PARAMS.strokeColor.b / 255];

    const selectedSelect = selects.find(select => select.value === e.value);
    if (selectedSelect) {
      program.uniforms.select.value = selectedSelect.value;
    }

    const selectedImage = images.findIndex(image => image.value.src === e.value);
    if (selectedImage !== -1) {
      program.uniforms.uTexture.value = textures[selectedImage];
    }
  });
};
