#version 300 es
precision mediump float;

uniform sampler2D uTexture;

in vec2 vUv;
out vec4 fragColor;

const float PI = 3.1415926;

vec3 solarization(vec3 texture) {
  return sin(texture * PI * 2.0) * 0.6 + texture;
}

void main() {
  vec2 uv = vUv;
  vec4 texture = texture(uTexture, uv);

  vec3 color = solarization(texture.rgb);

  fragColor = vec4(color, texture.a);
}
