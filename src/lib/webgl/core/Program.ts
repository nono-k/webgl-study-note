import type { AttributeMap, UniformMap } from '../type/shader-data.type';

// TODO anyを直す

export type ProgramOptions = {
  vertex: string;
  fragment: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  uniforms?: Record<string, any>;
};

export class Program {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  uniforms: Record<string, any>;

  constructor(gl: WebGL2RenderingContext, opts: ProgramOptions) {
    this.gl = gl;
    this.program = this.createProgram(opts.vertex, opts.fragment);
    this.uniforms = opts.uniforms ?? {};
  }

  private compile(type: number, source: string) {
    const gl = this.gl;
    const s = gl.createShader(type) as WebGLShader;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error(`Shader compile error: ${info}`);
    }
    return s;
  }

  private createProgram(vertexSrc: string, fragSrc: string) {
    const gl = this.gl;
    const v = this.compile(gl.VERTEX_SHADER, vertexSrc);
    const f = this.compile(gl.FRAGMENT_SHADER, fragSrc);
    const p = gl.createProgram();
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(p);
      gl.deleteProgram(p);
      throw new Error(`Program link error: ${info}`);
    }
    gl.deleteShader(v);
    gl.deleteShader(f);
    return p;
  }

  use() {
    this.gl.useProgram(this.program);
    this.setUniforms();
  }

  setUniforms() {
    const gl = this.gl;

    for (const name in this.uniforms) {
      const value = this.uniforms[name].value;
      const type = this.uniforms[name].type;
      const loc = gl.getUniformLocation(this.program, name);
      if (loc === null) continue;

      if (name === 'uTexture') {
        value.bind();
      }

      this.setUniform(gl, loc, value, type);
    }
  }

  setUniform(gl: WebGL2RenderingContext, loc: WebGLUniformLocation, value: number | number[] | Float32Array, type: string) {
    if (typeof value === 'number') {
      if (type === 'init') {
        gl.uniform1i(loc, value);
      } else {
        gl.uniform1f(loc, value);
      }
    } else if (Array.isArray(value)) {
      switch (value.length) {
        case 1:
          gl.uniform1f(loc, value[0]);
          break;
        case 2:
          gl.uniform2f(loc, value[0], value[1]);
          break;
        case 3:
          gl.uniform3f(loc, value[0], value[1], value[2]);
          break;
        case 4:
          gl.uniform4f(loc, value[0], value[1], value[2], value[3]);
          break;
        case 9:
          gl.uniformMatrix3fv(loc, false, value);
          break;
        case 16:
          gl.uniformMatrix4fv(loc, false, value);
          break;
      }
    }
  }
}
