export type TextureSource = string | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | ImageBitmap | ImageData;

export type TextureOptions = {
  wrapS?: number;
  wrapT?: number;
  minFilter?: number;
  magFilter?: number;
  generateMipmaps?: boolean;
  flipY?: boolean;
  premultiplyAlpha?: boolean;
  format?: number;
  internalFormat?: number;
  type?: number;
  width?: number;
  height?: number;
}


export class Texture {
  gl: WebGL2RenderingContext;
  texture: WebGLTexture;
  source: TextureSource | null = null;
  width = 0;
  height = 0;
  needsUpdate = false;

  wrapS: number;
  wrapT: number;
  minFilter: number;
  magFilter: number;
  generateMipmaps: boolean;
  flipY: boolean;
  premultiplyAlpha: boolean;
  format: number;
  internalFormat: number;
  type: number;

  constructor(gl: WebGL2RenderingContext, source: TextureSource, options: TextureOptions = {}) {
    this.gl = gl;

    const isVideo = source instanceof HTMLVideoElement;

    this.wrapS = options.wrapS ?? gl.CLAMP_TO_EDGE;
    this.wrapT = options.wrapT ?? gl.CLAMP_TO_EDGE;
    this.minFilter = options.minFilter ?? gl.LINEAR;
    this.magFilter = options.magFilter ?? gl.LINEAR;
    this.generateMipmaps = options.generateMipmaps ?? !isVideo;
    this.flipY = options.flipY ?? true;
    this.premultiplyAlpha = options.premultiplyAlpha ?? false;
    this.format = options.format ?? gl.RGBA;
    this.internalFormat = options.internalFormat ?? gl.RGBA;
    this.type = options.type ?? gl.UNSIGNED_BYTE;
    this.width = options.width ?? 0;
    this.height = options.height ?? 0;

    const tex = gl.createTexture();
    this.texture = tex;

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.minFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapT);

    if (typeof source === 'string') {
      this.source = source;
      this.load(source);
      return;
    }

    if (source) {
      this.source = source;
      this.needsUpdate = true;
      this.update();
      return;
    }

    if (this.width > 0 && this.height > 0) {
      gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
      this.needsUpdate = false;
    }
  }

  async load(source: TextureSource) {
    if (typeof source === 'string') {
      this.source = await this.loadImage(source);
    } else {
      this.source = source;
    }

    this.needsUpdate = true;
    this.update();
  }

  bind(uint = 0) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + uint);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  update(uint = 0) {
    this.bind(uint);

    const src = this.source;
    if (!src || typeof src === 'string') return;

    const isVideo = src instanceof HTMLVideoElement;
    if (isVideo && src.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
    if (!this.needsUpdate && !isVideo) return;

    const { width, height } = this.getSize(src);

    const gl = this.gl;
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);

    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      gl.texImage2D(gl.TEXTURE_2D, 0, this.internalFormat, this.format, this.type, src);
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.format, this.type, src);
    }

    if (this.generateMipmaps && !isVideo) {
      gl.generateMipmap(gl.TEXTURE_2D);
    }

    if (!isVideo) this.needsUpdate = false;
  }

  dispose() {
    this.gl.deleteTexture(this.texture);
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = e => reject(e);
    });
  }

  private getSize(src: Exclude<TextureSource, string>) {
    if (src instanceof HTMLVideoElement) {
      return { width: src.videoWidth, height: src.videoHeight };
    }

    return { width: src.width, height: src.height };
  }
}
