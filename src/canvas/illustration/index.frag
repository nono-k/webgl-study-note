#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float level;
uniform float stroke;
uniform vec3 strokeColor;
uniform int select;

in vec2 vUv;

out vec4 fragColor;

// グレイスケール
float gray(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

// ポスタリゼーション
vec3 posterization(vec3 texture, float level) {
  return vec3(floor(texture * level) / (level - 1.0));
}

// Sobelフィルタ
float kernelSobelX[9] = float[] (
  -1.0, 0.0, 1.0,
  -2.0, 0.0, 2.0,
  -1.0, 0.0, 1.0
);

float kernelSobelY[9] = float[] (
  -1.0, -2.0, -1.0,
  0.0, 0.0, 0.0,
  1.0, 2.0, 1.0
);

// 勾配の大きさ
float grad(vec2 pos, vec2 uv) {
  float gx = 0.0;
  float gy = 0.0;
  int k = 0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      // グレースケールにしてエッジ強度を取りやすくする
      float g = gray(texture(uTexture, uv + vec2(x, y) * pos).rgb);
      gx += g * kernelSobelX[k];
      gy += g * kernelSobelY[k];
      k++;
    }
  }
  return sqrt(gx * gx + gy * gy);
}

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;
  vec3 base = texture(uTexture, uv).rgb;

  // ポスタリゼーション
  vec3 posterization = posterization(base, level);

  // エッジ摘出
  float edge = grad(pos, uv);
  // エッジの太さ調整
  float line = step(1.0 - edge, stroke);

  // ポスタリゼーションとエッジを線の色で線形補間
  vec3 color = mix(posterization, strokeColor, line);

  if (select == 0) {
    // イラスト調
    fragColor = vec4(color, 1.0);
  } else if (select == 1) {
    // ポスタリゼーションのみ
    fragColor = vec4(posterization, 1.0);
  } else if (select == 2) {
    // エッジのみ
    fragColor = vec4(vec3(line), 1.0);
  }
}
