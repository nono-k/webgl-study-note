#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
// 光の方向(x, y)
uniform float lightDirectionX;
uniform float lightDirectionY;
uniform float ambient; // 環境光の強さ
uniform float strength; // 凸凹の強さ

in vec2 vUv;

out vec4 fragColor;

const float PI = 3.1415926;

// ライティング処理
vec3 lighting(vec3 color, vec3 normal) {
  // 法線ベクトル
  vec3 N = normalize(normal);
  // ライト方向(zは固定で正面から)
  vec3 L = normalize(vec3(lightDirectionX, lightDirectionY, 1.0));
  // 拡散反射
  float Id = max(dot(N, L), 0.0);

  // 環境光
  float Ia = ambient;

  // 視線方向(カメラ正面)
  vec3 V = normalize(vec3(0.0, 0.0, 1.0));
  // ハーフベクトル
  vec3 H = normalize(L + V);
  // 鏡面反射
  float Is = pow(max(dot(N, H), 0.0), 32.0);

  return color * (Id + Ia + Is);
}

// グレイスケール
float gray(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

// 高さマップ(輝度取得)
float height(vec2 uv) {
  vec3 c = texture(uTexture, uv).rgb;
  return gray(c);
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
  vec3 normal = vec3(-dx, -dy, 1.0 / strength);

  vec3 texColor = texture(uTexture, uv).rgb;

  // 色味調整
  vec3 grayColor = vec3(gray(texColor) * 0.8 + 0.2);

  vec3 color = lighting(grayColor, normal);

  fragColor = vec4(color, 1.0);
}

