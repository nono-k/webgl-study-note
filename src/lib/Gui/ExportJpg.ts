import type { Render, Scene } from '@/lib/webgl';
import { Mesh } from '@/lib/webgl/';

export function exportJpg(render: Render, scene: Scene, w: number, h: number) {
  const gl = render.gl;

  for (let i = 0; i < 16; i++) {
    gl.activeTexture(gl.TEXTURE0 + i);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

  const depth = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depth);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depth);

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.error('FBO incomplete:', status.toString(16));
  }

  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  scene.traverse(node => {
    if (node instanceof Mesh) {
      node.draw(gl);
    }
  });

  const pixels = new Uint8Array(w * h * 4);
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, render.canvas.width, render.canvas.height);

  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = w;
  tmpCanvas.height = h;
  const ctx = tmpCanvas.getContext('2d') as CanvasRenderingContext2D;
  const imageData = ctx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    const srcStart = (h - y - 1) * w * 4;
    const destStart = y * w * 4;
    imageData.data.set(pixels.subarray(srcStart, srcStart + w * 4), destStart);
  }

  ctx.putImageData(imageData, 0, 0);

  const jpgURL = tmpCanvas.toDataURL('image/jpeg', 0.9);

  const link = document.createElement('a');
  link.download = 'image.jpg';
  link.href = jpgURL;
  link.click();

  gl.deleteFramebuffer(fb);
  gl.deleteTexture(tex);
  gl.deleteRenderbuffer(depth);
}
