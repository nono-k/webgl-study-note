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
  u?: number;
  v?: number;
  w?: number;
  uDir?: number;
  vDir?: number;
  i?: number;
  ii?: number;
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

    Plane.buildPlane(position, normal, uv, index, width, height, 0, wSegs, hSegs);

    if (wireframe) {
      index = Plane.buildWireframeIndex(index);
    }

    Object.assign(attributes, {
      position: { size: 3, data: position },
      normal: { size: 3, data: normal },
      uv: { size: 2, data: uv },
      index: { data: index },
      wireframe,
    });

    super(gl, attributes);
  }

  static buildPlane(
    position: Float32Array,
    normal: Float32Array,
    uv: Float32Array,
    index: Uint32Array | Uint16Array,
    width: number,
    height: number,
    depth: number,
    wSegs: number,
    hSegs: number,
    u = 0,
    v = 1,
    w = 2,
    uDir = 1,
    vDir = -1,
    i = 0,
    ii = 0,
  ) {
    const io = i;
    let idx = i;
    let idx2 = ii;

    const segW = width / wSegs;
    const segH = height / hSegs;

    for (let iy = 0; iy <= hSegs; iy++) {
      const y = iy * segH - height / 2;
      for (let ix = 0; ix <= wSegs; ix++, idx++) {
        const x = ix * segW - width / 2;

        position[idx * 3 + u] = x * uDir;
        position[idx * 3 + v] = y * vDir;
        position[idx * 3 + w] = depth / 2;

        normal[idx * 3 + u] = 0;
        normal[idx * 3 + v] = 0;
        normal[idx * 3 + w] = depth >= 0 ? 1 : -1;

        uv[idx * 2] = ix / wSegs;
        uv[idx * 2 + 1] = 1 - iy / hSegs;

        if (iy === hSegs || ix === wSegs) continue;

        const a = io + ix + iy * (wSegs + 1);
        const b = io + ix + (iy + 1) * (wSegs + 1);
        const c = io + ix + (iy + 1) * (wSegs + 1) + 1;
        const d = io + ix + iy * (wSegs + 1) + 1;

        index[idx2 * 6] = a;
        index[idx2 * 6 + 1] = b;
        index[idx2 * 6 + 2] = d;
        index[idx2 * 6 + 3] = b;
        index[idx2 * 6 + 4] = c;
        index[idx2 * 6 + 5] = d;

        idx2++;
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
