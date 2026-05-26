import type { AttributeData } from '../type/Geometry.type';
import { Mat4 } from './Mat4';
import type { Quat } from './Quat';
import * as EulerFunc from './functions/EulerFunc';

export type EulerTuple = [x: number, y: number, z: number];
export type EulerOrder = 'XYZ' | 'XZY' | 'YXZ' | 'YZX' | 'ZXY' | 'ZYX';

const tmpMat4 = new Mat4();

export class Euler extends Array<number> {
  order: EulerOrder;
  onChange: () => void;

  constructor(x = 0, y = x, z = x, order: EulerOrder = 'YXZ') {
    super(x, y, z);
    this.order = order;
    this.onChange = () => {};

    const triggerProps = ['0', '1', '2'];
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

  set(x: number | Euler | EulerTuple, y: number | Euler | EulerTuple = x, z: number | Euler | EulerTuple = x) {
    if ((x as EulerTuple).length) return this.copy(x as EulerTuple);
    this[0] = x as number;
    this[1] = y as number;
    this[2] = z as number;
    this.onChange();
    return this;
  }

  copy(v: Euler | EulerTuple) {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    this.onChange();
    return this;
  }

  reorder(order: EulerOrder) {
    this.order = order;
    this.onChange();
    return this;
  }

  fromRotationMatrix(m: Mat4, order?: EulerOrder) {
    EulerFunc.fromRotationMatrix(this, m, order);
    this.onChange();
    return this;
  }

  fromQuaternion(q: Quat, order = this.order, isInternal = false) {
    tmpMat4.fromQuaternion(q);
    this.fromRotationMatrix(tmpMat4, order);
    // Avoid infinite recursion
    if (!isInternal) this.onChange();
    return this;
  }

  fromArray(a: number[] | AttributeData, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    return this;
  }

  toArray<T extends number[] | AttributeData>(a: T, o = 0): T {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    return a;
  }
}
