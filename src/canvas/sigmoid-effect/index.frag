#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform float gain;

in vec2 vUv;
out vec4 fragColor;

vec3 sigmoid(vec3 texture, float a) {
  return 1.0 / (1.0 + exp(-a * (texture - 0.5)));
}

void main() {
  vec2 uv = vUv;
  vec4 texture = texture(uTexture, uv);

  vec3 color = sigmoid(texture.rgb, gain);

  fragColor = vec4(color, texture.a);
}
