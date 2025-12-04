import type { Geometry } from './Geometry';
import type { Program } from './Program';
import { Scene } from './Scene';

export class Mesh extends Scene {
  geometry: Geometry;
  program: Program;

  constructor(gl: WebGL2RenderingContext, { geometry, program }: { geometry: Geometry; program: Program }) {
    super();
    this.geometry = geometry;
    this.program = program;
  }

  draw(gl: WebGL2RenderingContext) {
    const program = this.program;
    const geometry = this.geometry;

    program.use();
    geometry.bind(program);

    gl.drawElements(gl.TRIANGLES, geometry.indexCount, gl.UNSIGNED_SHORT, 0);

    geometry.unbind();
  }
}
