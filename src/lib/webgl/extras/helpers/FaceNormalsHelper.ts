import { Geometry } from '../../core/Geometry';
import { Mesh } from '../../core/Mesh';
import { Program } from '../../core/Program';
import type { Color } from '../../math/Color';
import { Mat3 } from '../../math/Mat3';
import { Vec3 } from '../../math/Vec3';

export interface FaceNormalsHelperOptions {
  size: number;
  color: Color;
}

export class FaceNormalsHelper extends Mesh {
  constructor(object: Mesh, options?: Partial<FaceNormalsHelperOptions>) {
    const { size = 0.1, color = new Vec3(0.15, 0.86, 0.86) } = options || {};
    const gl = object.gl;
    const positionData = object.geometry.attributes.position.data as Float32Array;
    const sizeData = new Float32Array([0, size]);

    const indexAttr = object.geometry.attributes.index as { data: Uint16Array } | undefined;
    const getIndex = indexAttr ? (i: number) => indexAttr.data[i] : (i: number) => i;
    const numVertices = indexAttr ? indexAttr.data.length : Math.floor(positionData.length / 3);

    const nNormals = Math.floor(numVertices / 3);
    const positionsArray = new Float32Array(nNormals * 2 * 3);
    const normalsArray = new Float32Array(nNormals * 2 * 3);
    const sizeArray = new Float32Array(nNormals * 2);

    const vA = new Vec3();
    const vB = new Vec3();
    const vC = new Vec3();
    const vCenter = new Vec3();
    const vNormal = new Vec3();

    for (let i = 0; i < numVertices; i += 3) {
      vA.fromArray(positionData, getIndex(i + 0) * 3);
      vB.fromArray(positionData, getIndex(i + 1) * 3);
      vC.fromArray(positionData, getIndex(i + 2) * 3);

      vCenter
        .add(vA, vB)
        .add(vC)
        .multiply(1 / 3);
      vA.sub(vA, vB);
      vC.sub(vC, vB);
      vNormal.cross(vC, vA).normalize();

      const i2 = i * 2;
      positionsArray.set(vCenter, i2);
      positionsArray.set(vCenter, i2 + 3);

      normalsArray.set(vNormal, i2);
      normalsArray.set(vNormal, i2 + 3);
      sizeArray.set(sizeData, (i / 3) * 2);
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
