#version 300 es
precision mediump float;

uniform vec2 uResolution;

in vec2 vUv;
out vec4 fragColor;

const int bayer[16] = int[] (
  1, 9, 3, 11,
  13, 5, 15, 7,
  4, 12,  2, 10,
  16, 8, 14, 6
);

const int swirl[16] = int[] (
  10, 9, 8, 7,
  11, 2, 1, 6,
  12, 3, 4, 5,
  13, 14, 15, 16
);

const int halftone[16] = int[] (
  1, 3, 15, 13,
  9, 11, 6, 8,
  16, 14, 2, 4,
  5, 7, 10, 12
);

float dithe(vec2 p, int[16] pat) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));

  return float(pat[y * 4 + x]) / 16.0;
}

void main() {
    vec2 uv = vUv;
    uv.y *= 4.0;

    int channel = int(mod(uv.y, 4.0));

    vec2 pixel = gl_FragCoord.xy;

    float threshold;

    if (channel == 0) {
      threshold = dithe(pixel, swirl);
    } else if (channel == 1) {
      threshold = dithe(pixel, halftone);
    } else if (channel == 2) {
      threshold = dithe(pixel, bayer);
    } else {
      fragColor = vec4(vec3(floor(uv.x * 16.0) / (16.0 - 1.0)), 1.0);
      return;
    }

    float color = uv.x > threshold ? 1.0 : 0.0;

    fragColor = vec4(vec3(color), 1.0);
}
