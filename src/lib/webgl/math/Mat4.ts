import type { Vec3 } from './Vec3';
import * as Mat4Func from './functions/Mat4Func';

export class Mat4 extends Array<number> {
  constructor(
    m00 = 1,
    m01 = 0,
    m02 = 0,
    m03 = 0,
    m10 = 0,
    m11 = 1,
    m12 = 0,
    m13 = 0,
    m20 = 0,
    m21 = 0,
    m22 = 1,
    m23 = 0,
    m30 = 0,
    m31 = 0,
    m32 = 0,
    m33 = 1,
  ) {
    super(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
  }

  get x(): number {
    return this[12];
  }

  get y(): number {
    return this[13];
  }

  get z(): number {
    return this[14];
  }

  get w(): number {
    return this[15];
  }

  set x(v: number) {
    this[12] = v;
  }

  set y(v: number) {
    this[13] = v;
  }

  set z(v: number) {
    this[14] = v;
  }

  set w(v: number) {
    this[15] = v;
  }

  set(
    m00: number | Mat4,
    m01: number,
    m02: number,
    m03: number,
    m10: number,
    m11: number,
    m12: number,
    m13: number,
    m20: number,
    m21: number,
    m22: number,
    m23: number,
    m30: number,
    m31: number,
    m32: number,
    m33: number,
  ): Mat4 {
    if (m00 instanceof Mat4) return this.copy(m00);
    Mat4Func.set(this, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    return this;
  }

  copy(m: Mat4): Mat4 {
    Mat4Func.copy(this, m);
    return this;
  }

  translate(v: Vec3, m?: Mat4): Mat4 {
    Mat4Func.translate(this, m ?? this, v);
    return this;
  }

  rotate(v: number, axis: Vec3, m?: Mat4): Mat4 {
    Mat4Func.rotate(this, m ?? this, v, axis);
    return this;
  }

  scale(v: Vec3 | number, m?: Mat4): Mat4 {
    Mat4Func.scale(this, m ?? this, typeof v === 'number' ? [v, v, v] : v);
    return this;
  }

  add(ma: Mat4, mb?: Mat4): Mat4 {
    if (mb) Mat4Func.add(this, ma, mb);
    else Mat4Func.add(this, this, ma);
    return this;
  }

  sub(ma: Mat4, mb?: Mat4): Mat4 {
    if (mb) Mat4Func.subtract(this, ma, mb);
    else Mat4Func.subtract(this, this, ma);
    return this;
  }

  multiply(ma: Mat4 | number, mb?: Mat4): Mat4 {
    if (typeof ma === 'number') {
      Mat4Func.multiplyScalar(this, this, ma);
    } else if (mb) {
      Mat4Func.multiply(this, ma, mb);
    } else {
      Mat4Func.multiply(this, this, ma);
    }
    return this;
  }

  identity(): Mat4 {
    Mat4Func.identity(this);
    return this;
  }

  fromPerspective({ fov, aspect, near, far }: { fov: number; aspect: number; near: number; far: number }): Mat4 {
    Mat4Func.perspective(this, fov, aspect, near, far);
    return this;
  }

  fromOrthogonal({
    left,
    right,
    bottom,
    top,
    near,
    far,
  }: { left: number; right: number; bottom: number; top: number; near: number; far: number }): Mat4 {
    Mat4Func.ortho(this, left, right, bottom, top, near, far);
    return this;
  }

  setPosition(v: Vec3): Mat4 {
    this.x = v[0];
    this.y = v[1];
    this.z = v[2];
    return this;
  }

  inverse(m?: Mat4): Mat4 {
    Mat4Func.invert(this, m ?? this);
    return this;
  }

  getTranslation(pos: Vec3): Mat4 {
    Mat4Func.getTranslation(pos, this);
    return this;
  }

  getScaling(scale: Vec3): Mat4 {
    Mat4Func.getScaling(scale, this);
    return this;
  }

  getMaxScaleOnAxis(): number {
    return Mat4Func.getMaxScaleOnAxis(this);
  }

  lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
    Mat4Func.targetTo(this, eye, target, up);
    return this;
  }

  determinant(): number {
    return Mat4Func.determinant(this);
  }
}
