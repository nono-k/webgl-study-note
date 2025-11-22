#version 300 es
precision mediump float;

uniform sampler2D uTexture;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 uv = vUv;
  vec4 texture = texture(uTexture, uv);

  vec3 color = 1.0 - texture.rgb;

  fragColor = vec4(color, texture.a);
}
