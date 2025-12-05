import * as Vec3Func from './functions/Vec3Func';

export type Vec3Tuple = [x: number, y: number, z: number];

export class Vec3 extends Array<number> {
  constructor(x = 0, y = x, z = x) {
    super(x, y, z);
  }

  get x(): number {
    return this[0];
  }

  get y(): number {
    return this[1];
  }

  get z(): number {
    return this[2];
  }

  set x(v: number) {
    this[0] = v;
  }

  set y(v: number) {
    this[1] = v;
  }

  set z(v: number) {
    this[2] = v;
  }

  set(x: number | Vec3, y?: number, z?: number) {
    if (x instanceof Vec3) return this.copy(x);
    Vec3Func.set(this, x, y, z);
    return this;
  }

  copy(v: Vec3): Vec3 {
    Vec3Func.copy(this, v);
    return this;
  }

  add(va: Vec3, vb?: Vec3): Vec3 {
    if (vb) Vec3Func.add(this, va, vb);
    else Vec3Func.add(this, this, va);
    return this;
  }

  sub(va: Vec3, vb?: Vec3): Vec3 {
    if (vb) Vec3Func.subtract(this, va, vb);
    else Vec3Func.subtract(this, this, va);
    return this;
  }

  multiply(v: Vec3 | number): Vec3 {
    if (v instanceof Vec3) Vec3Func.multiply(this, this, v);
    else Vec3Func.scale(this, this, v);
    return this;
  }

  divide(v: Vec3 | number): Vec3 {
    if (v instanceof Vec3) Vec3Func.divide(this, this, v);
    else Vec3Func.scale(this, this, 1 / v);
    return this;
  }

  inverse(v: Vec3): Vec3 {
    Vec3Func.inverse(this, v);
    return this;
  }

  len(): number {
    return Vec3Func.length(this);
  }

  distance(v?: Vec3): number {
    if (v) return Vec3Func.distance(this, v);
    return Vec3Func.length(this);
  }

  cross(va: Vec3, vb?: Vec3): Vec3 {
    if (vb) Vec3Func.cross(this, va, vb);
    else Vec3Func.cross(this, this, va);
    return this;
  }

  scale(v: number): Vec3 {
    Vec3Func.scale(this, this, v);
    return this;
  }

  normalize(): Vec3 {
    Vec3Func.normalize(this, this);
    return this;
  }

  dot(v: Vec3): number {
    return Vec3Func.dot(this, v);
  }

  equals(v: Vec3): boolean {
    return Vec3Func.exactEquals(this, v);
  }

  // applyMatrix3()

  angle(v: Vec3): number {
    return Vec3Func.angle(this, v);
  }

  lerp(v: Vec3, t: number): Vec3 {
    Vec3Func.lerp(this, this, v, t);
    return this;
  }

  clone(): Vec3 {
    return new Vec3(this[0], this[1], this[2]);
  }
}
