#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform float param1;
uniform float param2;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 uv = vUv;
  vec4 texture = texture(uTexture, uv);

  float p1 = param1;
  float p2 = param2;

  vec3 color = (p2 - p1) * texture.rgb + p1;

  fragColor = vec4(color, texture.a);
}
