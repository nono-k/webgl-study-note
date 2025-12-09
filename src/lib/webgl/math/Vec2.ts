import * as Vec2Func from './functions/Vec2Func';

export class Vec2 extends Array<number> {
  constructor(x = 0, y = x) {
    super(x, y);
  }

  get x(): number {
    return this[0];
  }

  get y(): number {
    return this[1];
  }

  set x(v: number) {
    this[0] = v;
  }

  set y(v: number) {
    this[1] = v;
  }

  set(x: number | Vec2, y?: number): Vec2 {
    if (x instanceof Vec2) return this.copy(x);
    Vec2Func.set(this, x, y);
    return this;
  }

  copy(v: Vec2): Vec2 {
    Vec2Func.copy(this, v);
    return this;
  }

  add(va: Vec2, vb?: Vec2): Vec2 {
    if (vb) Vec2Func.add(this, va, vb);
    else Vec2Func.add(this, this, va);
    return this;
  }

  sub(va: Vec2, vb?: Vec2): Vec2 {
    if (vb) Vec2Func.subtract(this, va, vb);
    else Vec2Func.subtract(this, this, va);
    return this;
  }

  multiply(v: Vec2 | number): Vec2 {
    if (v instanceof Vec2) Vec2Func.multiply(this, this, v);
    else Vec2Func.scale(this, this, v);
    return this;
  }

  divide(v: Vec2 | number): Vec2 {
    if (v instanceof Vec2) Vec2Func.divide(this, this, v);
    else Vec2Func.scale(this, this, 1 / v);
    return this;
  }

  inverse(v: Vec2): Vec2 {
    Vec2Func.inverse(this, v);
    return this;
  }

  len(): number {
    return Vec2Func.length(this);
  }

  distance(v?: Vec2): number {
    if (v) return Vec2Func.distance(this, v);
    return Vec2Func.length(this);
  }

  cross(va: Vec2, vb?: Vec2): number {
    if (vb) return Vec2Func.cross(va, vb);
    return Vec2Func.cross(this, va);
  }

  scale(v: number): Vec2 {
    Vec2Func.scale(this, this, v);
    return this;
  }

  normalize(): Vec2 {
    Vec2Func.normalize(this, this);
    return this;
  }

  dot(v: Vec2): number {
    return Vec2Func.dot(this, v);
  }

  equals(v: Vec2): boolean {
    return Vec2Func.exactEquals(this, v);
  }

  // applyMatrix3

  lerp(v: Vec2, a: number): Vec2 {
    Vec2Func.lerp(this, this, v, a);
    return this;
  }

  clone(): Vec2 {
    return new Vec2(this[0], this[1]);
  }
}
