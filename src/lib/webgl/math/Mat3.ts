import type { Vec2 } from './Vec2';
import type { Vec3 } from './Vec3';
import * as Mat3Func from './functions/Mat3Func';

export class Mat3 extends Array<number> {
  constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
    super(m00, m01, m02, m10, m11, m12, m20, m21, m22);
  }

  set(m00: number | Mat3, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number): Mat3 {
    if (m00 instanceof Mat3) return this.copy(m00);
    Mat3Func.set(this, m00, m01, m02, m10, m11, m12, m20, m21, m22);
    return this;
  }

  translate(v: Vec2, m?: Mat3): Mat3 {
    Mat3Func.translate(this, m ?? this, v);
    return this;
  }

  rotate(v: number, m?: Mat3): Mat3 {
    Mat3Func.rotate(this, m ?? this, v);
    return this;
  }

  scale(v: Vec2, m?: Mat3): Mat3 {
    Mat3Func.scale(this, m ?? this, v);
    return this;
  }

  multiply(ma: Mat3, mb?: Mat3): Mat3 {
    if (mb) {
      Mat3Func.multiply(this, ma, mb);
    } else {
      Mat3Func.multiply(this, this, ma);
    }
    return this;
  }

  identity(): Mat3 {
    Mat3Func.identity(this);
    return this;
  }

  copy(m: Mat3): Mat3 {
    Mat3Func.copy(this, m);
    return this;
  }

  // fromMatrix4(m: Mat4) {}

  fromBasis(vec3a: Vec3, vec3b: Vec3, vec3c: Vec3): Mat3 {
    this.set(vec3a[0], vec3a[1], vec3a[2], vec3b[0], vec3b[1], vec3b[2], vec3c[0], vec3c[1], vec3c[2]);
    return this;
  }

  inverse(m?: Mat3): Mat3 {
    Mat3Func.invert(this, m ?? this);
    return this;
  }

  // getNormalMatrix(m: Mat4): Mat3 {}
}
