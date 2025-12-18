#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform bool isHorizon;
uniform float wavelength; // 波数
uniform float amplitude; // 振幅
// 光の方向(x, y)
uniform float lightDirectionX;
uniform float lightDirectionY;
uniform float ambient; // 環境光の強さ
uniform bool isRefraction;

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

// 屈折量計算
float getRef(float dx, float dz, float h, float ref) {
  // 入射角計算
  float rA = sqrt(dx * dx + dz * dz);
  float sinA = -dx / rA;
  float tanA = -dx / dz;

  // 屈折角計算
  float sinB = ref * sinA;
  float tanB = sqrt(1.0 / (1.0 - sinB * sinB) - 1.0);

  // 符号調整
  if (dx > 0.0) tanB = -tanB;

  // 屈折によるオフセット量
  float res = (tanA - tanB) / (1.0 + tanA * tanB);

  return h * res;
}

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  // 波長
  float omega = 2.0 * PI / wavelength;

  float dx = 0.0;
  float dy = 0.0;

  // 横波 or 縦波の切り替え
  if (isHorizon) {
    dx = amplitude * omega * cos(omega * uv.x);
  } else {
    dy = amplitude * omega * cos(omega * uv.y);
  }

  // 波による擬似法線
  vec3 normal = vec3(-dx, -dy, 1.0);

  // 屈折率
  float ref = 0.75;

  // RGBずらし
  float refR = ref - 0.05;
  float refG = ref;
  float refB = ref + 0.05;

  // 屈折の強さ係数
  float h = 0.02;

  // 波の方向に応じたオフセット量
  float refOffset = isHorizon ? dx : dy;

  // RGBそれぞれのUVオフセット計算
  float offXR = getRef(refOffset, 1.0, h, refR);
  float offXG = getRef(refOffset, 1.0, h, refG);
  float offXB = getRef(refOffset, 1.0, h, refB);

  float r = texture(uTexture, uv + vec2(offXR, 0.0)).r;
  float g = texture(uTexture, uv + vec2(offXG, 0.0)).g;
  float b = texture(uTexture, uv + vec2(offXB, 0.0)).b;

  // 屈折後の色
  vec3 refrColor = vec3(r, g, b);

  vec3 texColor = texture(uTexture, uv).rgb;

  vec3 color = isRefraction
    ? lighting(refrColor, normal)
    : lighting(texColor, normal);

  fragColor = vec4(color, 1.0);
}

