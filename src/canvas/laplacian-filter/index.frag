#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 fragColor;

float kernel[9] = float[] (
  0.0, 1.0, 0.0,
  1.0, -4.0, 1.0,
  0.0, 1.0, 0.0
);

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  float v = 0.0;
  int k = 0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      // グレースケールにしてエッジ強度を取りやすくする
      float g = dot(texture(uTexture, uv + vec2(x, y) * pos).rgb, vec3(0.299, 0.587, 0.114));
      v += g * kernel[k];
      k++;
    }
  }

  vec3 color = vec3(0.0);

  color = v > 0.0 ?
    vec3(1.0, 1.0, 0.0) * v : // 差分のプラスの値
    vec3(0.0, 1.0, 1.0) * abs(v); // 差分のマイナスの値

  // エッジを強調するために定数倍かける
  color *= 4.0;

  fragColor = vec4(color, 1.0);
}
