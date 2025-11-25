#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform int select;

in vec2 vUv;

out vec4 fragColor;

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  vec3 col = vec3(0.0);

  if (select == 0) {
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        col += texture(uTexture, uv + vec2(x, y) * pos).rgb;
      }
    }
    col /= 9.0;
  } else if (select == 1) {
    for (int y = -2; y <= 2; y++) {
      for (int x = -2; x <= 2; x++) {
        col += texture(uTexture, uv + vec2(x, y) * pos).rgb;
      }
    }
    col /= 25.0;
  } else if (select == 2) {
    for (int y = -3; y <= 3; y++) {
      for (int x = -3; x <= 3; x++) {
        col += texture(uTexture, uv + vec2(x, y) * pos).rgb;
      }
    }
    col /= 49.0;
  }

  fragColor = vec4(col, 1.0);
}