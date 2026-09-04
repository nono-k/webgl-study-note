import { Geometry } from '../../core/Geometry';
import { Mesh } from '../../core/Mesh';
import { Program } from '../../core/Program';
import type { Color } from '../../math/Color';
import { Vec3 } from '../../math/Vec3';

export interface GridHelperOptions {
  size: number;
  divisions: number;
  color: Color;
}

export class GridHelper extends Mesh {
  constructor(gl: WebGL2RenderingContext, options?: Partial<GridHelperOptions>) {
    const { size = 10, divisions = 10, color = new Vec3(0.75, 0.75, 0.75) } = options || {};
    const numVertices = (size + 1) * 2 * 2;
    const vertices = new Float32Array(numVertices * 3);

    const hs = size / 2;
    for (let i = 0; i <= divisions; i++) {
      const t = i / divisions;
      const o = t * size - hs;

      vertices.set([o, 0, -hs, o, 0, hs], i * 12);
      vertices.set([-hs, 0, o, hs, 0, o], i * 12 + 6);
    }

    const index = new Uint16Array(numVertices);
    for (let i = 0; i < numVertices; i++) {
      index[i] = i;
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: vertices },
      index: { data: index },
      wireframe: {},
    });

    const program = new Program(gl, {
      vertex: `
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;

      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
      fragment: `
      precision mediump float;
      uniform vec3 color;

      void main() {
        gl_FragColor = vec4(color, 1.0);
      }
      `,
      uniforms: {
        color: { value: color },
      },
    });

    super(gl, { geometry, program });
  }
}
