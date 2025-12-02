#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform int select;

in vec2 vUv;

out vec4 fragColor;

float kernelX[9] = float[] (
  0.0, 0.0, 0.0,
  0.0, -1.0, 1.0,
  0.0, 0.0, 0.0
);

float kernelY[9] = float[] (
  0.0, 1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, 0.0, 0.0
);

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  float gx = 0.0;
  float gy = 0.0;

  int k = 0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      // グレースケールにしてエッジ強度を取りやすくする
      float g = dot(texture(uTexture, uv + vec2(x, y) * pos).rgb, vec3(0.299, 0.587, 0.114));
      gx += g * kernelX[k];
      gy += g * kernelY[k];
      k++;
    }
  }

  // selectが0の場合は横方向の差分を、1のときは縦方向の差分
  float v = (select == 0) ? gx : gy;
  vec3 color = vec3(0.0);

  if (select == 0 || select == 1) {
    color = v > 0.0 ?
      vec3(1.0, 1.0, 0.0) * v : // 差分のプラスの値
      vec3(0.0, 1.0, 1.0) * abs(v); // 差分のマイナスの値
  } else {
    // 勾配の大きさ
    color = vec3(sqrt(gx * gx + gy * gy));
  }

  fragColor = vec4(color, 1.0);
}
