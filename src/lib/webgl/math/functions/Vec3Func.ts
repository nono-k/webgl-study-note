type Vec3 = Array<number>;

export function length(a: Vec3): number {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}

export function copy(out: Vec3, a: Vec3): Vec3 {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

export function set(out: Vec3, x: number, y?: number, z?: number): Vec3 {
  out[0] = x;
  out[1] = y ?? x;
  out[2] = z ?? x;
  return out;
}

export function add(out: Vec3, a: Vec3, b: Vec3): Vec3 {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}

export function subtract(out: Vec3, a: Vec3, b: Vec3): Vec3 {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

export function multiply(out: Vec3, a: Vec3, b: Vec3): Vec3 {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}

export function divide(out: Vec3, a: Vec3, b: Vec3): Vec3 {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}

export function scale(out: Vec3, a: Vec3, b: number): Vec3 {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}

export function distance(a: Vec3, b: Vec3): number {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  const z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
}

export function inverse(out: Vec3, a: Vec3): Vec3 {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}

export function normalize(out: Vec3, a: Vec3): Vec3 {
  const x = a[0];
  const y = a[1];
  const z = a[2];
  let len = x * x + y * y + z * z;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function cross(out: Vec3, a: Vec3, b: Vec3): Vec3 {
  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  const ax = a[0],
    ay = a[1],
    az = a[2],
    bx = b[0],
    by = b[1],
    bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

export function lerp(out: Vec3, a: Vec3, b: Vec3, t: number): Vec3 {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}

export function angle(a: Vec3, b: Vec3): number {
  const tempA = [0, 0, 0];
  const tempB = [0, 0, 0];

  copy(tempA, a);
  copy(tempB, b);

  normalize(tempA, tempA);
  normalize(tempB, tempB);

  const cosine = dot(tempA, tempB);

  if (cosine > 1.0) {
    return 0;

    // biome-ignore lint/style/noUselessElse: <explanation>
  } else if (cosine < -1.0) {
    return Math.PI;

    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    return Math.acos(cosine);
  }
}

export function exactEquals(a: Vec3, b: Vec3): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
