type Vec2 = Array<number>;

export function copy(out: Vec2, a: Vec2): Vec2 {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}

export function set(out: Vec2, x: number, y?: number): Vec2 {
  out[0] = x;
  out[1] = y ?? x;
  return out;
}

export function add(out: Vec2, a: Vec2, b: Vec2): Vec2 {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}

export function subtract(out: Vec2, a: Vec2, b: Vec2): Vec2 {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}

export function multiply(out: Vec2, a: Vec2, b: Vec2): Vec2 {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}

export function divide(out: Vec2, a: Vec2, b: Vec2): Vec2 {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}

export function scale(out: Vec2, a: Vec2, b: number): Vec2 {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}

export function distance(a: Vec2, b: Vec2): number {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
}

export function length(a: Vec2): number {
  const x = a[0];
  const y = a[1];
  return Math.sqrt(x * x + y * y);
}

export function inverse(out: Vec2, a: Vec2): Vec2 {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
}

export function normalize(out: Vec2, a: Vec2): Vec2 {
  const x = a[0];
  const y = a[0];
  let len = x * x + y * y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}

export function dot(a: Vec2, b: Vec2): number {
  return a[0] * b[0] + a[1] * b[1];
}

export function cross(a: Vec2, b: Vec2): number {
  return a[0] * b[1] - a[1] * b[0];
}

export function lerp(out: Vec2, a: Vec2, b: Vec2, t: number): Vec2 {
  const ax = a[0];
  const ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}

export function exactEquals(a: Vec2, b: Vec2): boolean {
  return a[0] === b[0] && a[1] === b[1];
}
