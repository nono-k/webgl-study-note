#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
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

void main() {
  vec2 uv = vUv;

  // 画面中心
  vec2 center = vec2(0.5);

  // 中心からの相対位置
  vec2 p = uv - center;

  // アスペクト補正（円形の波を保つ）
  p.x *= uResolution.x / uResolution.y;

  // 中心からの距離
  float r = length(p);

  // 波長
  float omega = 2.0 * PI / wavelength;

  // 高さ変化の勾配量（∂z/∂r）
  float dz = amplitude * omega * cos(omega * r);

  // 勾配ベクトル（∂z/∂x, ∂z/∂y）
  vec2 grad = dz * ((p) / r);

  // 波による擬似法線
  vec3 normal = vec3(-grad.x, -grad.y, 1.0);

  // 屈折率
  float ref = 0.75;

  // RGBずらし
  float refR = ref - 0.25;
  float refG = ref;
  float refB = ref + 0.25;

  // 屈折の強さ係数
  float h = 0.02;

  // 勾配方向を正規化（UVずらし用）
  vec2 Ngrad = normalize(grad);

  // RGBそれぞれのUVオフセット計算
  vec2 offsetR = Ngrad * h * refR;
  vec2 offsetG = Ngrad * h * refG;
  vec2 offsetB = Ngrad * h * refB;

  float rCol = texture(uTexture, uv + offsetR).r;
  float gCol = texture(uTexture, uv + offsetG).g;
  float bCol = texture(uTexture, uv + offsetB).b;

  // 屈折後の色
  vec3 refrColor = vec3(rCol, gCol, bCol);

  vec3 texColor = texture(uTexture, uv).rgb;

  vec3 color = isRefraction
    ? lighting(refrColor, normal)
    : lighting(texColor, normal);

  fragColor = vec4(color, 1.0);
}

