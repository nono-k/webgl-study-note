#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform int select;

in vec2 vUv;

out vec4 fragColor;

float kernelDerivativeX[9] = float[] (
  0.0, 0.0, 0.0,
  0.0, -1.0, 1.0,
  0.0, 0.0, 0.0
);

float kernelDerivativeY[9] = float[] (
  0.0, 1.0, 0.0,
  0.0, -1.0, 0.0,
  0.0, 0.0, 0.0
);

float kernelPrewittX[9] = float[] (
  -1.0, 0.0, 1.0,
  -1.0, 0.0, 1.0,
  -1.0, 0.0, 1.0
);

float kernelPrewittY[9] = float[] (
  -1.0, -1.0, -1.0,
  0.0, 0.0, 0.0,
  1.0, 1.0, 1.0
);

float kernelSobelX[9] = float[] (
  -1.0, 0.0, 1.0,
  -2.0, 0.0, 2.0,
  -1.0, 0.0, 1.0
);

float kernelSobelY[9] = float[] (
  -1.0, -2.0, -1.0,
  0.0, 0.0, 0.0,
  1.0, 2.0, 1.0
);

float grad(vec2 pos, vec2 uv, float kernelX[9], float kernelY[9]) {
  float gx = 0.0;
  float gy = 0.0;
  int k = 0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      // グレースケールにしてエッジ強度を取りやすくする
      float g = dot(texture(uTexture, uv + vec2(x, y) * pos).rgb, vec3(0.299, 0.587, 0.114));
      gx += g * kernelX[k];
      gy += g * kernelY[k];
      k++;
    }
  }
  return sqrt(gx * gx + gy * gy);
}

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  vec3 color = vec3(0.0);

  if (select == 0) {
    color = vec3(grad(pos, uv, kernelDerivativeX, kernelDerivativeY));
    color *= 24.0;
  } else if (select == 1) {
    color = vec3(grad(pos, uv, kernelPrewittX, kernelPrewittY));
    color *= 4.0;
  } else if (select == 2) {
    color = vec3(grad(pos, uv, kernelSobelX, kernelSobelY));
    color *= 3.0;
  }

  color = clamp(color*0.5, 0.0, 1.0);

  fragColor = vec4(color, 1.0);
}
