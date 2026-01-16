#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;

uniform int select;

in vec2 vUv;

out vec4 fragColor;

vec3 red = vec3(1.0, 0.0, 0.0);
vec3 green = vec3(0.0, 1.0, 0.0);
vec3 blue = vec3(0.0, 0.0, 1.0);

vec3 layer(vec2 uv) {
  vec3 topColor = vec3(uv.x);
  vec3 bottomColor =
    red * step(uv.x, 1.0 / 3.0) +
    green * step(1.0 / 3.0, uv.x) * step(uv.x, 2.0 / 3.0) +
    blue * step(2.0 / 3.0, uv.x);

  return mix(topColor, bottomColor, step(uv.y, 0.5));
}

vec3 blendScreen(vec3 base, vec3 blend) {
  return 1.0 - (1.0 - base) * (1.0 - blend);
}

void main() {
  vec2 uv = vUv;

  vec3 baseTex = texture(uTexture, uv).rgb;
  vec3 blendTex;

  vec3 color;

  if (select == 0) {
    color = baseTex;
  } else if (select == 1) {
    blendTex = texture(uTexture, uv).rgb;
    color = blendScreen(baseTex, blendTex);
  } else if (select == 2) {
    blendTex = layer(uv);
    color = blendScreen(baseTex, blendTex);
  }

  fragColor = vec4(color, 1.0);
}
