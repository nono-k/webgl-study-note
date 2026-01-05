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
      uMove: { value: [0.0, 0.0] },
    },
  });

  const mesh = new Mesh(gl, { geometry: plane, program });

  scene.add(mesh);

  // biome-ignore lint/style/useConst: <explanation>
  let clickUv: [number, number] | [0, 0] = [0, 0];

  const calcImageRect = (
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    margin: number,
  ): { ox: number; oy: number; drawW: number; drawH: number } => {
    const cw = canvas.width;
    const ch = canvas.height;

    const ca = cw / ch;
    const ia = image.width / image.height;

    let drawW: number;
    let drawH: number;

    if (ia > ca) {
      drawW = cw * (1.0 - 2.0 * margin);
      drawH = drawW / ia;
    } else {
      drawH = ch * (1.0 - 2.0 * margin);
      drawW = drawH * ia;
    }

    const ox = (cw - drawW) * 0.5;
    const oy = (ch - drawH) * 0.5;

    return { ox, oy, drawW, drawH };
  };

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const px = mx / rect.width;
    const py = my / rect.height;

    const tex = program.uniforms.uTexture.value;
    const margin = 0.15;

    const { ox, oy, drawW, drawH } = calcImageRect(canvas, tex, margin);

    // 画像外は無視
    if (mx < ox || mx > ox + drawW || my < oy || my > oy + drawH) {
      return;
    }

    drawRedCircle(px, py);

    const u = (mx - ox) / drawW;
    const v = 1.0 - (my - oy) / drawH;

    move.value[0] = u;
    move.value[1] = v;
  });

  const drawRedCircle = (x: number, y: number) => {
    const uiCanvas = document.getElementById('ui-canvas') as HTMLCanvasElement;
    const uiCtx = uiCanvas.getContext('2d');
    if (!uiCtx) return;

    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    uiCanvas.width = canvas.width;
    uiCanvas.height = canvas.height;

    const px = x * uiCanvas.width;
    const py = y * uiCanvas.height;

    uiCtx.strokeStyle = 'red';
    uiCtx.lineWidth = 2;
    uiCtx.beginPath();
    uiCtx.arc(px, py, 10, 0, Math.PI * 2);
    uiCtx.stroke();
  };

  const update = () => {
    render.render({ scene });

    requestAnimationFrame(update);
  };

  update();

  const resize = () => {
    render.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', resize);

  const move = program.uniforms.uMove;

  const PARAMS = {
    moveX: move.value[0],
    moveY: move.value[1],
  };

  // biome-ignore format: este array no debe ser formateado
  const pane = new Gui();
  // pane.addBinding(PARAMS, 'moveX', { min: 0, max: 1, step: 0.01 });
  // pane.addBinding(PARAMS, 'moveY', { min: 0, max: 1, step: 0.01 });
  pane.addSelectedImage(images);
  pane.addSaveBtn(render, scene);

  pane.on('change', e => {
    move.value[0] = PARAMS.moveX;
    move.value[1] = PARAMS.moveY;

    const selectedImage = images.findIndex(image => image.value.src === e.value);
    if (selectedImage !== -1) {
      program.uniforms.uTexture.value = textures[selectedImage];
    }
  });
};
