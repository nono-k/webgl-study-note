#version 300 es
precision mediump float;

in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 uv = vUv;
  fragColor = vec4(uv, 0.0, 1.0);
}
