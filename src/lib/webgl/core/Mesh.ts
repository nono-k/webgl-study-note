import type { Camera } from './Camera';
import type { Geometry } from './Geometry';
import type { Program } from './Program';

import { Mat3 } from '../math/Mat3';
import { Mat4 } from '../math/Mat4';
import { Scene } from './Scene';
import { Transform } from './Transform';

type MeshRenderCallback = (renderInfo: { mesh: Mesh; camera?: Camera }) => void;

export class Mesh extends Scene {
  gl: WebGL2RenderingContext;
  geometry: Geometry;
  program: Program;

  modelViewMatrix: Mat4;
  beforeRenderCallbacks: MeshRenderCallback[];
  afterRenderCallbacks: MeshRenderCallback[];

  constructor(gl: WebGL2RenderingContext, { geometry, program }: { geometry: Geometry; program: Program }) {
    super();
    this.gl = gl;
    this.geometry = geometry;
    this.program = program;

    this.modelViewMatrix = new Mat4();
    this.beforeRenderCallbacks = [];
    this.afterRenderCallbacks = [];
  }

  onBeforeRender(f: MeshRenderCallback) {
    this.beforeRenderCallbacks.push(f);
    return this;
  }

  onAfterRender(f: MeshRenderCallback) {
    this.afterRenderCallbacks.push(f);
    return this;
  }

  draw({ camera }: { camera?: Camera }) {
    const program = this.program;
    const geometry = this.geometry;
    const gl = this.gl;
    const mode = geometry.attributes.wireframe ? gl.LINES : gl.TRIANGLES;

    if (camera) {
      if (!program.uniforms.modelMatrix) {
        Object.assign(program.uniforms, {
          modelMatrix: { value: null },
          viewMatrix: { value: null },
          modelViewMatrix: { value: null },
          projectionMatrix: { value: null },
          cameraPosition: { value: null },
        });
      }

      program.uniforms.projectionMatrix.value = camera.projectionMatrix;
      program.uniforms.cameraPosition.value = camera.worldPosition;
      program.uniforms.viewMatrix.value = camera.viewMatrix;
      this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
      program.uniforms.modelMatrix.value = this.worldMatrix;
      program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    this.beforeRenderCallbacks.forEach(f => f({ mesh: this, camera }));

    program.use();
    geometry.bind(program);
    gl.drawElements(mode, geometry.indexCount, gl.UNSIGNED_SHORT, 0);

    // biome-ignore lint/complexity/noForEach: <explanation>
    this.afterRenderCallbacks.forEach(f => f({ mesh: this, camera }));
  }
}
