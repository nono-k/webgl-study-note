import { Geometry } from '../../core/Geometry';
import { Mesh } from '../../core/Mesh';
import { Program } from '../../core/Program';
import type { Color } from '../../math/Color';
import { Vec3 } from '../../math/Vec3';

export interface AxesHelperOptions {
  size: number;
  symmetric: boolean;
  xColor: Color;
  yColor: Color;
  zColor: Color;
}

export class AxesHelper extends Mesh {
  constructor(gl: WebGL2RenderingContext, options?: Partial<AxesHelperOptions>) {
    const {
      size = 1,
      symmetric = false,
      xColor = new Vec3(0.96, 0.21, 0.32),
      yColor = new Vec3(0.44, 0.64, 0.11),
      zColor = new Vec3(0.18, 0.52, 0.89),
    } = options || {};

    const a = symmetric ? -size : 0;
    const b = size;

    const vertices = new Float32Array([a, 0, 0, b, 0, 0, 0, a, 0, 0, b, 0, 0, 0, a, 0, 0, b]);

    const colors = new Float32Array([...xColor, ...xColor, ...yColor, ...yColor, ...zColor, ...zColor]);

    const index = new Uint16Array([0, 1, 2, 3, 4, 5]);

    const geometry = new Geometry(gl, {
      position: { size: 3, data: vertices },
      index: { size: 1, data: index },
      color: { size: 3, data: colors },
      wireframe: {},
    });

    const program = new Program(gl, {
      vertex: `
      attribute vec3 position;
      attribute vec3 color;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;

      varying vec3 vColor;

      void main() {
        vColor = color;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
      `,
      fragment: `
      precision highp float;
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(vColor, 1.0);
      }
      `,
    });

    super(gl, { geometry, program });
  }
}
