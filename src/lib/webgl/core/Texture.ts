export class Texture {
  gl: WebGL2RenderingContext;
  texture: WebGLTexture;
  width = 0;
  height = 0;

  constructor(gl: WebGL2RenderingContext, source: string | HTMLImageElement) {
    this.gl = gl;
    const tex = gl.createTexture();
    this.texture = tex;

    gl.bindTexture(gl.TEXTURE_2D, tex);

    // TODO Texture Managerでbindするようにする
    // 基本的な設定
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    this.load(source);
  }

  async load(source: string | HTMLImageElement) {
    const gl = this.gl;
    const img =
      typeof source === 'string' ? await this._loadImage(source) : source;

    this.width = img.width;
    this.height = img.height;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  bind(uint = 0) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + uint);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  dispose() {
    this.gl.deleteTexture(this.texture);
  }

  private _loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = e => reject(e);
    });
  }
}
