#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform float gamma;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 uv = vUv;
  vec4 texture = texture(uTexture, uv);

  vec3 color = pow(texture.rgb, vec3(1.0 / gamma));

  fragColor = vec4(color, texture.a);
}
