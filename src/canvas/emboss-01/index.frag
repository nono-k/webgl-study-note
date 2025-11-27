#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;

in vec2 vUv;

out vec4 fragColor;

float kernel[9] = float[] (
  0.0, -1.0, 0.0,
  -1.0, 0.0, 1.0,
  0.0, 1.0, 0.0
);

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  vec3 sum = vec3(0.0);
  int k = 0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec3 c = texture(uTexture, uv + vec2(x, y) * pos).rgb;
      sum += c * kernel[k++];
    }
  }

  sum = sum + 0.5;

  fragColor = vec4(sum, 1.0);
}
