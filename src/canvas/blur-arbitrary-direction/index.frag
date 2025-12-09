#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float angle;
uniform float radius;

in vec2 vUv;

out vec4 fragColor;

const float PI = 3.1415926;

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  float rad = angle * PI / 180.0;
  vec2 dir = vec2(cos(rad), sin(rad));
  vec2 step = dir * pos * radius;

  vec3 color = vec3(0.0);
  float total = 0.0;

  for (int i = -2; i <= 2; i++) {
    color += texture(uTexture, uv + step * float(i)).rgb;
    total += 1.0;
  }

  fragColor = vec4(color / total, 1.0);
}
