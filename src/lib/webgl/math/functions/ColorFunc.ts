const NAMES: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  green: '#00ff00',
  blue: '#0000ff',
  fuchsia: '#ff00ff',
  cyan: '#00ffff',
  yellow: '#ffff00',
  orange: '#ff8000',
};

type RGB = [number, number, number];
type Color = string | number | RGB;

export function hexToRGB(hex: string): RGB {
  if (hex.length === 4) {
    hex = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (!rgb) {
    console.warn(`Unable to convert hex string ${hex} to rgb values`);
    return [0, 0, 0];
  }

  return [Number.parseInt(rgb[1], 16) / 255, Number.parseInt(rgb[2], 16) / 255, Number.parseInt(rgb[3], 16) / 255];
}

export function numberToRGB(num: number): RGB {
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export function parseColor(color: Color): RGB {
  // Number
  if (typeof color === 'number') {
    return numberToRGB(color);
  }

  // RGB
  if (Array.isArray(color)) {
    return color;
  }

  // Hex
  if (color[0] === '#') {
    return hexToRGB(color);
  }

  // Names
  const namedColor = NAMES[color.toLowerCase()];

  if (namedColor) {
    return hexToRGB(namedColor);
  }

  console.warn(`Color format not recognised: ${color}`);
  return [0, 0, 0];
}
