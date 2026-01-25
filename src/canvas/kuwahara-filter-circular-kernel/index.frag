#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform int size; // 半径

in vec2 vUv;
out vec4 fragColor;

struct QuadAcc {
  vec3 cSum;
  float lSum;
  float lSum2;
  int count;
};

// グレイスケール
float gray(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

void sampleCircularQuadrants(
  vec2 uv,
  int r,
  out QuadAcc q[4]
) {
  vec2 texel = 1.0 / uResolution;
  int r2 = r * r;

  // 初期化
  for (int i = 0; i < 4; i++) {
    q[i].cSum  = vec3(0.0);
    q[i].lSum  = 0.0;
    q[i].lSum2 = 0.0;
    q[i].count = 0;
  }

  for (int x = -r; x <= r; x++) {
    for (int y = -r; y <= r; y++) {

      // 円判定
      if (x*x + y*y > r2) continue;

      int id;
      if (x >= 0 && y >= 0)      id = 0;
      else if (x < 0 && y >= 0)  id = 1;
      else if (x < 0 && y < 0)   id = 2;
      else                       id = 3;

      vec3 c = texture(
        uTexture,
        uv + vec2(float(x), float(y)) * texel
      ).rgb;

      float l = gray(c);

      q[id].cSum  += c;
      q[id].lSum  += l;
      q[id].lSum2 += l * l;
      q[id].count++;
    }
  }
}

vec3 selectMinVarianceColor(QuadAcc q[4]) {
  float minVar = 1e10;
  vec3 result = vec3(0.0);
  int hits = 0;

  for (int i = 0; i < 4; i++) {
    if (q[i].count == 0) continue;

    float n = float(q[i].count);
    float mean = q[i].lSum / n;
    float var = q[i].lSum2 / n - mean * mean;

    vec3 avg = q[i].cSum / n;

    if (var < minVar) {
      minVar = var;
      result = avg;
      hits = 1;
    } else if (var == minVar) {
      result += avg;
      hits++;
    }
  }

  return result / float(max(hits, 1));
}

vec4 kuwahara(vec2 uv, int radius) {
  QuadAcc q[4];
  sampleCircularQuadrants(uv, radius, q);

  vec3 color = selectMinVarianceColor(q);
  return vec4(clamp(color, 0.0, 1.0), 1.0);
}

void main() {
  fragColor = kuwahara(vUv, size);
}
