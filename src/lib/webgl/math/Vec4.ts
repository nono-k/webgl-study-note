import * as Vec4Func from './functions/Vec4Func';

export class Vec4 extends Array<number> {
  constructor(x = 0, y = x, z = x, w = x) {
    super(x, y, z, w);
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

  get w(): number {
    return this[3];
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

  set w(v: number) {
    this[3] = v;
  }

  set(x: number | Vec4, y?: number, z?: number, w?: number): Vec4 {
    if (x instanceof Vec4) return this.copy(x);
    Vec4Func.set(this, x, y, z, w);
    return this;
  }

  copy(v: Vec4): Vec4 {
    Vec4Func.copy(this, v);
    return this;
  }

  normalize(): Vec4 {
    Vec4Func.normalize(this, this);
    return this;
  }

  multiply(v: number): Vec4 {
    Vec4Func.scale(this, this, v);
    return this;
  }

  dot(v: Vec4): number {
    return Vec4Func.dot(this, v);
  }
}
