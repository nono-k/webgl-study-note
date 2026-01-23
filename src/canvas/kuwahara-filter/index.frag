#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;

uniform int size;

in vec2 vUv;

out vec4 fragColor;

// グレイスケール
float gray(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

vec4 sampleQuadrant(
  vec2 uv,
  int x1, int x2,
  int y1, int y2,
  int sampleCount
) {
  vec2 texel = 1.0 / uResolution;

  float lSum = 0.0;
  float lSum2 = 0.0;
  vec3 cSum = vec3(0.0);

  for (int x = x1; x <= x2; x++) {
    for (int y = y1; y < y2; y++) {
      vec3 c = texture(uTexture, uv + vec2(float(x), float(y)) * texel).rgb;

      float l = gray(c);
      lSum += l;
      lSum2 += l * l;
      cSum += clamp(c, 0.0, 1.0);
    }
  }

  float n = float(sampleCount);
  float mean = lSum / n;
  float var = abs(lSum2 / n - mean * mean);

  return vec4(cSum / n, var);
}

vec4 kuwahara(vec2 uv, int kernel) {
  float windowSize = float(kernel * 2 + 1);
  int quadrantSize = int(ceil(windowSize * 0.5));
  int samples = quadrantSize * quadrantSize;

  vec4 q1 = sampleQuadrant(uv, -kernel, 0, -kernel, 0, samples);
  vec4 q2 = sampleQuadrant(uv, 0, kernel, -kernel, 0, samples);
  vec4 q3 = sampleQuadrant(uv, 0, kernel, 0, kernel, samples);
  vec4 q4 = sampleQuadrant(uv, -kernel, 0, 0, kernel, samples);

  float minVar = min(q1.a, min(q2.a, min(q3.a, q4.a)));

  bvec4 mask = bvec4(
    q1.a == minVar,
    q2.a == minVar,
    q3.a == minVar,
    q4.a == minVar
  );

  int count = int(mask.x) + int(mask.y) + int(mask.z) + int(mask.w);

  vec3 result;

  if (count > 1) {
    result = (q1.rgb + q2.rgb + q3.rgb + q4.rgb) * 0.25;
  } else {
    result =
      q1.rgb * float(mask.x) +
      q2.rgb * float(mask.y) +
      q3.rgb * float(mask.z) +
      q4.rgb * float(mask.w);
  }

  return vec4(clamp(result, 0.0, 1.0), 1.0);
}

void main() {
  vec2 uv = vUv;
  vec4 color = kuwahara(uv, size);

  fragColor = color;
}
