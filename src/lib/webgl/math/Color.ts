import * as ColorFunc from './functions/ColorFunc';

export type ColorTuple = [r: number, g: number, b: number];

export type ColorRepresentation =
  | ColorTuple
  | Color
  | 'black'
  | 'white'
  | 'red'
  | 'green'
  | 'blue'
  | 'fuchsia'
  | 'cyan'
  | 'yellow'
  | 'orange'
  | string
  | number;

export class Color extends Array<number> {
  constructor(color?: ColorRepresentation) {
    if (Array.isArray(color)) return super(...color);
    return super(...ColorFunc.parseColor(...arguments));
  }

  get r(): number {
    return this[0];
  }

  get g(): number {
    return this[1];
  }

  get b(): number {
    return this[2];
  }

  set r(v: number) {
    this[0] = v;
  }

  set g(v: number) {
    this[1] = v;
  }

  set b(v: number) {
    this[2] = v;
  }

  set(color: ColorRepresentation): this {
    if (Array.isArray(color)) return this.copy(color);
    return this.copy(ColorFunc.parseColor(...arguments));
  }

  copy(v: Color): this {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    return this;
  }
}
