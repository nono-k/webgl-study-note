import type { Program } from './Program';

interface Attribute {
  size: number;
  data: Float32Array | Uint16Array;
  type?: number;
  normalized?: boolean;
  location?: number;
}

export class Geometry {
  gl: WebGL2RenderingContext;
  attributes: Record<string, Attribute>;
  vao: WebGLVertexArrayObject;
  vbos: Record<string, WebGLBuffer> = {};
  ibo: WebGLBuffer | null = null;
  indexCount = 0;
  vertexCount = 0;

  constructor(gl: WebGL2RenderingContext, attributes: Record<string, Attribute>) {
    this.gl = gl;
    this.attributes = attributes;

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    for (const name in attributes) {
      const attr = attributes[name];
      const { data } = attr;

      if (name === 'index') {
        // --- index buffer (EBO) ---
        this.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        this.indexCount = (data as Uint16Array).length;
      } else {
        // --- vertex attribute buffer ---
        const buf = gl.createBuffer();
        this.vbos[name] = buf;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      }
    }

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  bind(program: Program) {
    const gl = this.gl;
    gl.bindVertexArray(this.vao);

    for (const name in this.attributes) {
      if (name === 'index') continue;
      const attr = this.attributes[name];
      const loc = attr.location ?? gl.getAttribLocation(program.program, name);
      if (loc === -1) continue;

      const buf = this.vbos[name];
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, attr.size, attr.type ?? gl.FLOAT, !!attr.normalized, 0, 0);
    }

    if (this.ibo) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
  }

  unbind() {
    this.gl.bindVertexArray(null);
  }

  dispose() {
    const gl = this.gl;
    gl.deleteVertexArray(this.vao);
    for (const name in this.vbos) {
      gl.deleteBuffer(this.vbos[name]);
    }
    if (this.ibo) gl.deleteBuffer(this.ibo);
  }
}
