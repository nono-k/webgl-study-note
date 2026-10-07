#version 300 es
precision mediump float;

uniform samplerCube uEnvironment;
uniform vec3 cameraPosition;

in vec3 vWorldPosition;
in vec3 vWorldNormal;
out vec4 fragColor;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 normal = vWorldNormal;

  vec3 reflectionDirection = reflect(-viewDir, normal);
  vec4 texture = texture(uEnvironment, reflectionDirection);

  fragColor = texture;
}
