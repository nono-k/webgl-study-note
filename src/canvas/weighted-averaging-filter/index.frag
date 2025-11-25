#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform int select;

in vec2 vUv;

out vec4 fragColor;

float kernel16[9] = float[] (
  1.0, 2.0, 1.0,
  2.0, 4.0, 2.0,
  1.0, 2.0, 1.0
);

float kernel256[25] = float[] (
  1.0, 4.0, 6.0, 4.0, 1.0,
  4.0, 16.0, 24.0, 16.0, 4.0,
  6.0, 24.0, 36.0, 24.0, 6.0,
  4.0, 16.0, 24.0, 16.0, 4.0,
  1.0, 4.0, 6.0, 4.0, 1.0
);

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  vec3 sum = vec3(0.0);
  int k = 0;

  if (select == 0) {
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec3 c = texture(uTexture, uv + vec2(x, y) * pos).rgb;
        sum += c * kernel16[k++];
      }
    }
    sum /= 16.0;
  } else if (select == 1) {
    for (int y = -2; y <= 2; y++) {
      for (int x = -2; x <= 2; x++) {
        vec3 c = texture(uTexture, uv + vec2(x, y) * pos).rgb;
        sum += c * kernel256[k++];
      }
    }
    sum /= 256.0;
  }

  fragColor = vec4(sum, 1.0);
}
