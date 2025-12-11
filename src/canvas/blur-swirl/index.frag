#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float xPos;
uniform float yPos;
uniform float angle;

in vec2 vUv;

out vec4 fragColor;

const float PI = 3.1415926;

// 偏角を求めるatanの拡張版
float atan2(float y, float x) {
  return x == 0.0 ? sign(y) * PI / 2.0 : atan(y, x);
}

// 直交座標を極座標に変換
vec2 xy2pol(vec2 xy) {
  return vec2(length(xy), atan2(xy.y, xy.x));
}

// 極座標を直交座標に変換
vec2 pol2xy(vec2 pol) {
  float r = pol.x;
  float theta = pol.y;
  return r * vec2(cos(theta), sin(theta));
}

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;
  vec2 center = vec2(xPos, yPos);

  vec2 d = uv - center;
  vec2 polar = xy2pol(d);

  float rad = angle * PI / 180.0;

  vec3 color = vec3(0.0);
  float total = 0.0;

  for (int i = -2; i <= 2; i++) {
    float t = float(i) / 2.0;
    float theta = polar.y + t * rad;
    vec2 sampleUv = pol2xy(vec2(polar.x, theta)) + center;

    color += texture(uTexture, sampleUv).rgb;
    total += 1.0;
  }

  fragColor = vec4(color / total, 1.0);
}