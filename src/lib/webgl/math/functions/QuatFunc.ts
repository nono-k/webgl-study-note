import type { Quat } from '../Quat';
import * as vec4 from './Vec4Func';

export function identity(out: Quat): Quat {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

export function setAxisAngle(out: Quat, axis: number[], rad: number): Quat {
  const _rad = rad * 0.5;
  const s = Math.sin(_rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(_rad);
  return out;
}

export function multiply(out: Quat, a: Quat, b: Quat): Quat {
  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  const ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  const bx = b[0],
    by = b[1],
    bz = b[2],
    bw = b[3];

  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

export function rotateX(out: Quat, a: Quat, rad: number): Quat {
  const _rad = rad * 0.5;

  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  const ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  const bx = Math.sin(_rad);
  const bw = Math.cos(_rad);

  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}

export function rotateY(out: Quat, a: Quat, rad: number): Quat {
  const _rad = rad * 0.5;

  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  const ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  const by = Math.sin(_rad);
  const bw = Math.cos(_rad);

  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}

export function rotateZ(out: Quat, a: Quat, rad: number): Quat {
  const _rad = rad * 0.5;

  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  const ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  const bz = Math.sin(_rad);
  const bw = Math.cos(_rad);

  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}

export function slerp(out: Quat, a: Quat, b: Quat, t: number): Quat {
  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  const ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  let bx = b[0],
    by = b[1],
    bz = b[2],
    bw = b[3];

  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  let omega: number, cosom: number, sinom: number, scale0: number, scale1: number;

  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }

  if (1.0 - cosom > 0.000001) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1.0 - t;
    scale1 = t;
  }

  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

export function invert(out: Quat, a: Quat): Quat {
  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  const a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3];
  const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  const invDot = dot ? 1.0 / dot : 0;

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}

export function conjugate(out: Quat, a: Quat): Quat {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}

export function fromMat3(out: Quat, m: number[]): Quat {
  const fTrace = m[0] + m[4] + m[8];
  let fRoot: number;

  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1.0);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    let i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    const j = (i + 1) % 3;
    const k = (i + 2) % 3;

    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}

export function fromEuler(out: Quat, euler: number[], order = 'YXZ'): Quat {
  const sx = Math.sin(euler[0] * 0.5);
  const cx = Math.cos(euler[0] * 0.5);
  const sy = Math.sin(euler[1] * 0.5);
  const cy = Math.cos(euler[1] * 0.5);
  const sz = Math.sin(euler[2] * 0.5);
  const cz = Math.cos(euler[2] * 0.5);

  if (order === 'XYZ') {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === 'YXZ') {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === 'ZXY') {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === 'ZYX') {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === 'YZX') {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === 'XZY') {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  }

  return out;
}

export const copy = vec4.copy;
export const set = vec4.set;
export const add = vec4.add;
export const scale = vec4.scale;
export const dot = vec4.dot;
export const lerp = vec4.lerp;
export const length = vec4.length;
export const normalize = vec4.normalize;
