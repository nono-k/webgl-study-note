#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform int select;
uniform float sigma;

in vec2 vUv;

out vec4 fragColor;

const float PI = 3.1415926;

float gaussian(int x, int y, float sigma) {
  float sigma2 = sigma * sigma;
  float inv_2pi_sigma2 = 1.0 / (2.0 * PI * sigma2);
  float r2 = float(x * x + y * y);
  return inv_2pi_sigma2 * exp(-r2 / (2.0 * sigma2));
}

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  vec3 sum = vec3(0.0);
  float wsum = 0.0;
  vec3 col = vec3(0.0);

  if (select == 0) {
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        float w = gaussian(x, y, sigma);
        sum += texture(uTexture, uv + vec2(x, y) * pos).rgb * w;
        wsum += w;
      }
    }
    col = sum / wsum;
  } else if (select == 1) {
    for (int y = -2; y <= 2; y++) {
      for (int x = -2; x <= 2; x++) {
        float w = gaussian(x, y, sigma);
        sum += texture(uTexture, uv + vec2(x, y) * pos).rgb * w;
        wsum += w;
      }
    }
    col = sum / wsum;
  } else if (select == 2) {
    for (int y = -3; y <= 3; y++) {
      for (int x = -3; x <= 3; x++) {
        float w = gaussian(x, y, sigma);
        sum += texture(uTexture, uv + vec2(x, y) * pos).rgb * w;
        wsum += w;
      }
    }
    col = sum / wsum;
  }

  fragColor = vec4(col, 1.0);
}
