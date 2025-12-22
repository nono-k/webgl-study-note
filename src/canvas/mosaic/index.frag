#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float blockSize;

in vec2 vUv;

out vec4 fragColor;

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  vec2 block = pos * blockSize;
  vec2 mosaic = (floor(uv / block) + 0.5) * block;

  vec3 color = texture(uTexture, mosaic).rgb;
  fragColor = vec4(color, 1.0);
}
