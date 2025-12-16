#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float strength; // 凸凹の強さ

in vec2 vUv;

out vec4 fragColor;

// 高さマップ(輝度取得)
float height(vec2 uv) {
  vec3 c = texture(uTexture, uv).rgb;
  return dot(c, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  // 偏微分の近似を行うため差分を求める
  float hL = height(uv - vec2(pos.x, 0.0));
  float hR = height(uv + vec2(pos.x, 0.0));
  float hD = height(uv - vec2(0.0, pos.y));
  float hU = height(uv + vec2(0.0, pos.y));

  // 偏微分
  float dx = (hR - hL) * strength;
  float dy = (hU - hD) * strength;

  // 法線計算
  vec3 normal = normalize(vec3(-dx, -dy, 1.0));

  // [-1, 1] → [0, 1]に正規化
  vec3 color = normal * 0.5 + 0.5;

  fragColor = vec4(color, 1.0);
}