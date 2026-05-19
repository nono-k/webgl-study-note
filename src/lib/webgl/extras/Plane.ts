import { Geometry } from '../core/Geometry';
import type { AttributeMap } from '../type/Geometry.type';

interface PlaneOptions {
  width: number;
  height: number;
  widthSegments: number;
  heightSegments: number;
  wireframe: boolean;
  attributes: AttributeMap;
}

interface BuildPlaneOptions {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;
  width: number;
  height: number;
  depth: number;
  wSegs: number;
  hSegs: number;
}

export class Plane extends Geometry {
  constructor(gl: WebGL2RenderingContext, options?: Partial<PlaneOptions>) {
    const { width = 1, height = 1, widthSegments = 1, heightSegments = 1, wireframe = false, attributes = {} } = options ?? {};

    const wSegs = widthSegments;
    const hSegs = heightSegments;

    const num = (wSegs + 1) * (hSegs + 1);
    const numIndices = wSegs * hSegs * 6;

    const position = new Float32Array(num * 3);
    const normal = new Float32Array(num * 3);
    const uv = new Float32Array(num * 2);
    let index = numIndices > 65535 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);

    Plane.buildPlane({ position, normal, uv, index, width, height, depth: 0, wSegs, hSegs });

    if (wireframe) {
      index = Plane.buildWireframeIndex(index);
    }

    Object.assign(attributes, {
      position: { size: 3, data: position },
      // normal: { size: 3, data: normal },
      uv: { size: 2, data: uv },
      index: { data: index },
      wireframe,
    });

    super(gl, attributes);
  }

  static buildPlane(options: BuildPlaneOptions) {
    const { position, normal, uv, index, width, height, depth, wSegs, hSegs } = options;
    const u = 0;
    const v = 1;
    const w = 2;
    const uDir = 1;
    const vDir = 1;
    let i = 0;
    const io = i;
    let ii = 0;

    const segW = width / wSegs;
    const segH = height / hSegs;

    for (let iy = 0; iy <= hSegs; iy++) {
      const y = iy * segH - height / 2;
      for (let ix = 0; ix <= wSegs; ix++, i++) {
        const x = ix * segW - width / 2;

        position[i * 3 + u] = x * uDir;
        position[i * 3 + v] = y * vDir;
        position[i * 3 + w] = depth / 2;

        normal[i * 3 + u] = 0;
        normal[i * 3 + v] = 0;
        normal[i * 3 + w] = depth >= 0 ? 1 : -1;

        uv[i * 2] = ix / wSegs;
        uv[i * 2 + 1] = 1 - iy / hSegs;

        if (iy === hSegs || ix === wSegs) continue;

        const a = io + ix + iy * (wSegs + 1);
        const b = io + ix + (iy + 1) * (wSegs + 1);
        const c = io + ix + (iy + 1) * (wSegs + 1) + 1;
        const d = io + ix + iy * (wSegs + 1) + 1;

        index[ii * 6] = a;
        index[ii * 6 + 1] = b;
        index[ii * 6 + 2] = d;
        index[ii * 6 + 3] = b;
        index[ii * 6 + 4] = c;
        index[ii * 6 + 5] = d;

        ii++;
      }
    }
  }

  static buildWireframeIndex(index: Uint16Array | Uint32Array) {
    const edges: number[] = [];

    for (let i = 0; i < index.length; i += 3) {
      const a = index[i];
      const b = index[i + 1];
      const c = index[i + 2];

      edges.push(a, b, b, c, c, a);
    }

    return index instanceof Uint32Array ? new Uint32Array(edges) : new Uint16Array(edges);
  }
}
