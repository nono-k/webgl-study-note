export type CubeTextureSource = {
  px: string;
  nx: string;
  py: string;
  ny: string;
  pz: string;
  nz: string;
};

export class CubeTexture {
  gl: WebGLRenderingContext;
  texture: WebGLTexture;
  source: CubeTextureSource;

  width = 0;
  height = 0;
  needsUpdate = false;

  minFilter: number;
  magFilter: number;
  generateMipmap: boolean;

  constructor(
    gl: WebGL2RenderingContext,
    source: CubeTextureSource,
    options: {
      minFilter?: number;
      magFilter?: number;
      generateMipmap?: boolean;
    } = {},
  ) {
    this.gl = gl;
    this.source = source;
    this.minFilter = options.minFilter ?? gl.LINEAR;
    this.magFilter = options.magFilter ?? gl.LINEAR;
    this.generateMipmap = options.generateMipmap ?? true;
    this.texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, this.minFilter);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, this.magFilter);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

    this.load();
  }

  async load() {
    const gl = this.gl;

    const images = await Promise.all([
      this.loadImage(this.source.px),
      this.loadImage(this.source.nx),
      this.loadImage(this.source.py),
      this.loadImage(this.source.ny),
      this.loadImage(this.source.pz),
      this.loadImage(this.source.nz),
    ]);

    const [positiveX, negativeX, positiveY, negativeY, positiveZ, negativeZ] = images;

    this.width = positiveX.width;
    this.height = positiveX.height;

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

    const faces = [
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, image: positiveX },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, image: negativeX },
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, image: positiveY },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, image: negativeY },
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, image: positiveZ },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, image: negativeZ },
    ];

    for (const face of faces) {
      gl.texImage2D(face.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, face.image);
    }

    if (this.generateMipmap) {
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    }

    this.needsUpdate = false;
  }

  update(uint = 0) {
    const gl = this.gl;

    gl.activeTexture(gl.TEXTURE0 + uint);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
  }

  dispose() {
    this.gl.deleteTexture(this.texture);
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }
}
