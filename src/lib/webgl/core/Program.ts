import type { AttributeMap, UniformMap } from '../type/shader-data.type';

// TODO anyを直す

export type ProgramOptions = {
  vertex: string;
  fragment: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  uniforms?: Record<string, any>;
};

export interface UnifomInfo extends WebGLActiveInfo {
  uniformName: string;
  nameComponents: string[];
}

export class Program {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  uniforms: Record<string, any>;
  uniformLocations: Map<UnifomInfo, WebGLUniformLocation> = new Map();

  constructor(gl: WebGL2RenderingContext, opts: ProgramOptions) {
    this.gl = gl;
    this.program = this.createProgram(opts.vertex, opts.fragment);
    this.uniforms = opts.uniforms ?? {};
    this.setShaderUniforms();
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

  private setShaderUniforms() {
    this.uniformLocations = new Map();

    const numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
      const uniform = this.gl.getActiveUniform(this.program, i) as UnifomInfo;
      const loc = this.gl.getUniformLocation(this.program, uniform.name);
      if (loc) {
        this.uniformLocations.set(uniform, loc);
      }

      const split = uniform.name.match(/(\w+)/g);

      uniform.uniformName = split ? split[0] : '';
      uniform.nameComponents = split?.slice(1) || [];
    }
  }

  use() {
    this.gl.useProgram(this.program);
    this.setUniforms();
  }

  setUniforms() {
    const gl = this.gl;
    let textureUint = -1;

    // for (const name in this.uniforms) {
    //   const value = this.uniforms[name].value;
    //   const type = this.uniforms[name].type;
    //   const loc = gl.getUniformLocation(this.program, name);
    //   if (loc === null) continue;

    //   if (name === 'uTexture') {
    //     value.bind();
    //   }

    //   this.setUniform(gl, loc, value, type);
    // }

    this.uniformLocations.forEach((location, activeUniform) => {
      // biome-ignore lint/style/useConst: <explanation>
      let uniform = this.uniforms[activeUniform.uniformName];

      for (const component of activeUniform.nameComponents) {
        if (!uniform) break;

        if (component in uniform) {
          uniform = uniform[component];
        } else if (Array.isArray(uniform.value)) {
          break;
        } else {
          uniform = undefined;
          break;
        }
      }

      if (!uniform) {
        return console.warn(`Uniform ${activeUniform.name} has not been supplied`);
      }

      if (uniform && uniform.value === undefined) {
        return console.warn(`Uniform ${activeUniform.name} uniform is missing a value parameter`);
      }

      if (uniform.value.texture) {
        textureUint = textureUint + 1;
        uniform.value.bind(textureUint);
        return this.setUniform(gl, location, textureUint, 'init');
      }

      if (uniform.value.length && uniform.value[0].texture) {
        const textureUnits = [] as number[];

        // biome-ignore lint/complexity/noForEach: <explanation>
        uniform.value.forEach((value: { update: (unit: number) => void }) => {
          textureUint = textureUint + 1;
          value.update(textureUint);
          textureUnits.push(textureUint);
        });
        return this.setUniform(gl, location, textureUnits, 'init');
      }

      this.setUniform(gl, location, uniform.value, uniform.type);
    });
  }

  setUniform(gl: WebGL2RenderingContext, loc: WebGLUniformLocation, value: number | number[] | Float32Array, type: string) {
    if (typeof value === 'boolean') {
      gl.uniform1i(loc, value ? 1 : 0);
      return;
    }

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
