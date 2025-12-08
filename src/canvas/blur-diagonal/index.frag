#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform int kernelSize;

in vec2 vUv;

out vec4 fragColor;

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  vec3 col = vec3(0.0);
  float weight = 0.0;

  for (int y = -kernelSize; y <= kernelSize; y++) {
    for (int x = -kernelSize; x <= kernelSize; x++) {
      if (x == y) {
        col += texture(uTexture, uv + vec2(x, y) * pos).rgb;
        weight += 1.0;
      }
    }
  }

  fragColor = vec4(col / weight, 1.0);
}
