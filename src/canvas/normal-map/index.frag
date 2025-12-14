#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float strength;

in vec2 vUv;

out vec4 fragColor;

float height(vec2 uv) {
  vec3 c = texture(uTexture, uv).rgb;
  return dot(c, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  float hL = height(uv - vec2(pos.x, 0.0));
  float hR = height(uv + vec2(pos.x, 0.0));
  float hD = height(uv - vec2(0.0, pos.y));
  float hU = height(uv + vec2(0.0, pos.y));

  float dx = (hR - hL) * strength;
  float dy = (hU - hD) * strength;

  vec3 normal = normalize(vec3(-dx, -dy, 1.0));

  vec3 color = normal * 0.5 + 0.5;

  fragColor = vec4(color, 1.0);
}