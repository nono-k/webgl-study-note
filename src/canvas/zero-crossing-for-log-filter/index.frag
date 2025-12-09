#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float sigma;
uniform float threshold;

in vec2 vUv;
out vec4 fragColor;

const float PI = 3.14159265359;

float LoG(vec2 offset) {
  float r2 = offset.x * offset.x + offset.y * offset.y;
  float norm = 1.0 / (2.0 * PI * pow(sigma, 6.0));
  return norm * (r2 - 2.0 * sigma * sigma) * exp(-r2 / (2.0 * sigma * sigma));
}

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  float v = 0.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      float g = dot(texture(uTexture, uv + vec2(x, y) * pos).rgb, vec3(0.299, 0.587, 0.114));
      v += g * LoG(vec2(x, y));
    }
  }

  vec3 color = vec3(v);
  // 適当な倍率をかける
  color *= 4.0;
  // 中間的な濃淡になるように一定値を足す
  color += 0.5;

  // ゼロ交差判定
  if (color.r >= -threshold && color.r <= threshold) {
    color = vec3(1.0);
  } else {
    color = vec3(0.0);
  }

  fragColor = vec4(color, 1.0);
}
