#version 300 es
precision mediump float;

uniform samplerCube uEnviroment;
uniform vec3 cameraPosition;

in vec3 vWorldPosition;
in vec3 vWorldNormal;
out vec4 fragColor;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 normal = normalize(vWorldNormal);

  vec3 reflectionDirection = reflect(-viewDir, normal);
  vec4 texture = texture(uEnviroment, reflectionDirection);

  fragColor = texture;
}
