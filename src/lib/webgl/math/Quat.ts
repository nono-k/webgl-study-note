import type { AttributeData } from '../type/Geometry.type';
import type { Euler } from './Euler';
import type { Mat3 } from './Mat3';
import type { Vec3 } from './Vec3';
import * as QuatFunc from './functions/QuatFunc';

export type QuatTuple = [x: number, y: number, z: number, w: number];

export class Quat extends Array<number> {
  onChange: () => void;
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(x, y, z, w);

    this.onChange = () => {};
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
    this.onChange();
  }

  set y(v: number) {
    this[1] = v;
    this.onChange();
  }

  set z(v: number) {
    this[2] = v;
    this.onChange();
  }

  set w(v: number) {
    this[3] = v;
    this.onChange();
  }

  identity() {
    QuatFunc.identity(this);
    this.onChange();
    return this;
  }

  set(x: number, y?: number, z?: number, w?: number): Quat {
    QuatFunc.set(this, x, y, z, w);
    this.onChange();
    return this;
  }

  copy(q: Quat | QuatTuple): Quat {
    QuatFunc.copy(this, q);
    this.onChange();
    return this;
  }

  rotateX(a: number): Quat {
    QuatFunc.rotateX(this, this, a);
    this.onChange();
    return this;
  }

  rotateY(a: number): Quat {
    QuatFunc.rotateY(this, this, a);
    this.onChange();
    return this;
  }

  rotateZ(a: number): Quat {
    QuatFunc.rotateZ(this, this, a);
    this.onChange();
    return this;
  }

  inverse(q = this): Quat {
    QuatFunc.invert(this, q);
    this.onChange();
    return this;
  }

  conjugate(q = this): Quat {
    QuatFunc.conjugate(this, q);
    this.onChange();
    return this;
  }

  normalize(q = this): Quat {
    QuatFunc.normalize(this, q);
    this.onChange();
    return this;
  }

  multiply(qA: Quat, qB?: Quat): Quat {
    if (qB) {
      QuatFunc.multiply(this, qA, qB);
    } else {
      QuatFunc.multiply(this, this, qA);
    }
    this.onChange();
    return this;
  }

  dot(v: Quat): number {
    return QuatFunc.dot(this, v);
  }

  fromMatrix3(matrix3: Mat3): Quat {
    QuatFunc.fromMat3(this, matrix3);
    this.onChange();
    return this;
  }

  fromEuler(euler: Euler, isInternal = false): Quat {
    QuatFunc.fromEuler(this, euler, euler.order);
    if (!isInternal) this.onChange();
    return this;
  }

  fromAxisAngle(axis: Vec3, a: number): Quat {
    QuatFunc.setAxisAngle(this, axis, a);
    this.onChange();
    return this;
  }

  slerp(q: Quat, t: number): Quat {
    QuatFunc.slerp(this, this, q, t);
    this.onChange();
    return this;
  }

  fromArray(a: number[], o = 0): Quat {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    this[3] = a[o + 3];
    this.onChange();
    return this;
  }

  toArray<T extends number[] | AttributeData>(a: T, o = 0): T {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    return a;
  }
}
