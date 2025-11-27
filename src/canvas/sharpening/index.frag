#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform int k;

in vec2 vUv;

out vec4 fragColor;

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  vec3 sum = vec3(0.0);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      float w;

      // カーネルを動的に評価
      if (x == 0 && y == 0) {
        w = float(9 + 8 * k); // 中央係数
      } else {
        w = float(-k); // 周辺係数
      }

      vec3 c = texture(uTexture, uv + vec2(x, y) * pos).rgb;
      sum += c * w;
    }
  }

  sum /= 9.0;

  fragColor = vec4(sum, 1.0);
}
