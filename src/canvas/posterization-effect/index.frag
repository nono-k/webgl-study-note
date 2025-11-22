#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform float level;

in vec2 vUv;

out vec4 fragColor;

vec3 posterization(vec3 texture, float level) {
  return vec3(floor(texture * level) / (level - 1.0));
}

void main() {
  vec2 uv = vUv;
  vec4 texture = texture(uTexture, uv);

  vec3 color = posterization(texture.rgb, level);

  fragColor = vec4(color, texture.a);
}
