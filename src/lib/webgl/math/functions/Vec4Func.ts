type Vec4 = Array<number>;

export function copy(out: Vec4, a: Vec4): Vec4 {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

export function set(out: Vec4, x: number, y?: number, z?: number, w?: number): Vec4 {
  out[0] = x;
  out[1] = y ?? x;
  out[2] = z ?? x;
  out[3] = w ?? x;
  return out;
}

export function add(out: Vec4, a: Vec4, b: Vec4): Vec4 {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

export function scale(out: Vec4, a: Vec4, b: number): Vec4 {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

export function length(a: Vec4): number {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  const w = a[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
}

export function normalize(out: Vec4, a: Vec4): Vec4 {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  const w = a[3];
  let len = length(a);
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}

export function dot(a: Vec4, b: Vec4): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

export function lerp(out: Vec4, a: Vec4, b: Vec4, t: number): Vec4 {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);

  return out;
}
