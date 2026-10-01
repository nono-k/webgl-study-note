#version 300 es
precision mediump float;

uniform samplerCube uEnviroment;

in vec3 vDirection;
out vec4 fragColor;

void main() {
  vec3 direction = normalize(vDirection);
  vec4 texture = texture(uEnviroment, direction);

  fragColor = texture;
}
