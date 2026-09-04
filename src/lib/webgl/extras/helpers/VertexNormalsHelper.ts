import { Geometry } from '../../core/Geometry';
import { Mesh } from '../../core/Mesh';
import { Program } from '../../core/Program';
import type { Color } from '../../math/Color';
import { Mat3 } from '../../math/Mat3';
import { Vec3 } from '../../math/Vec3';

export interface VertexNormalsHelperOptions {
  size: number;
  color: Color;
}

export class VertexNormalsHelper extends Mesh {
  constructor(object: Mesh, options?: Partial<VertexNormalsHelperOptions>) {
    const { size = 0.1, color = new Vec3(0.86, 0.16, 0.86) } = options || {};
    const gl = object.gl;
    const normalAttr = object.geometry.attributes.normal;
    const normalData = normalAttr.data as Float32Array;
    const nNormals = normalAttr.count ?? normalData.length / (normalAttr.size ?? 3);
    const positionsArray = new Float32Array(nNormals * 2 * 3);
    const normalsArray = new Float32Array(nNormals * 2 * 3);
    const sizeArray = new Float32Array(nNormals * 2);

    const positionData = object.geometry.attributes.position.data as Float32Array;
    const sizeData = new Float32Array([0, size]);

    for (let i = 0; i < nNormals; i++) {
      const i6 = i * 6;
      const i3 = i * 3;

      const pSub = positionData.subarray(i3, i3 + 3);
      positionsArray.set(pSub, i6);
      positionsArray.set(pSub, i6 + 3);

      const nSub = normalData.subarray(i3, i3 + 3);
      normalsArray.set(nSub, i6);
      normalsArray.set(nSub, i6 + 3);

      sizeArray.set(sizeData, i * 2);
    }

    const index = new Uint16Array(nNormals * 2);
    for (let i = 0; i < index.length; i++) {
      index[i] = i;
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positionsArray },
      normal: { size: 3, data: normalsArray },
      size: { size: 1, data: sizeArray },
      index: { size: 1, data: index },
      wireframe: {},
    });

    const program = new Program(gl, {
      vertex: `
      attribute vec3 position;
      attribute vec3 normal;
      attribute float size;

      uniform mat4 viewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat4 objectWorldMatrix;
      uniform mat3 worldNormalMatrix;

      void main() {
        vec3 n = normalize(worldNormalMatrix * normal) * size;
        vec3 p = (objectWorldMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * vec4(p + n, 1.0);
      }
      `,
      fragment: `
      precision highp float;
      uniform vec3 color;

      void main() {
        gl_FragColor = vec4(color, 1.0);
      }
      `,
      uniforms: {
        color: { value: color },
        worldNormalMatrix: { value: new Mat3() },
        objectWorldMatrix: { value: object.worldMatrix },
      },
    });

    super(gl, { geometry, program });
  }
}
