#version 300 es
precision mediump float;

uniform samplerCube uEnvironment;

in vec3 vDirection;
out vec4 fragColor;

void main() {
  vec3 direction = normalize(vDirection);
  vec4 texture = texture(uEnvironment, direction);

  fragColor = texture;
}
