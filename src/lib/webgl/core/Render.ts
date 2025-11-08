export class Render {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement, options?: WebGLContextAttributes) {
    this.canvas = canvas;

    const gl = canvas.getContext('webgl2', options);

    if (!gl) {
      throw new Error('WebGL2 not supported');
    }

    this.gl = gl;
  }

  setSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  fitScreen() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fitScreenSquare() {
    const size = Math.min(window.innerWidth, window.innerHeight);
    this.setSize(size, size);
  }
}
