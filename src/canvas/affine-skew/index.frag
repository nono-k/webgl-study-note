#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform float skewX;
uniform float skewY;
uniform bool isCenter;

in vec2 vUv;
out vec4 fragColor;

const float PI = 3.1415926;

vec3 drawAxis(vec2 p) {
  float axisW = fwidth(p.x) * 2.0;
  float xAxis = smoothstep(axisW, 0.0, abs(p.y));
  float yAxis = smoothstep(axisW, 0.0, abs(p.x));

  vec3 col = vec3(0.05);
  col = mix(col, vec3(1.0,0.0,0.0), yAxis);
  col = mix(col, vec3(0.0,0.0,1.0), xAxis);
  return col;
}

// ------------------------
// 2D アフィン行列生成
// ------------------------
mat3 translate(vec2 t) {
  return mat3(
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    t.x, t.y, 1.0
  );
}

mat3 scale(vec2 s) {
  return mat3(
    s.x, 0.0, 0.0,
    0.0, s.y, 0.0,
    0.0, 0.0, 1.0
  );
}

mat3 rotate(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat3(
    c,  -s, 0.0,
    s,  c, 0.0,
    0.0, 0.0, 1.0
  );
}

mat3 skew(float skewX, float skewY) {
  float radX = skewX * PI / 180.0;
  float radY = skewY * PI / 180.0;
  return mat3(
    1.0, tan(radY), 0.0,
    tan(radX), 1.0, 0.0,
    0.0, 0.0, 1.0
  );
}

void main() {
  vec2 uv = vUv;
  vec2 pos = uv * 4.0 - 1.0;

  vec3 color = drawAxis(pos);
  float aspect = 1.777777; // 16:9

  mat3 M;

  if (isCenter) {
    M =
        translate(vec2(0.5)) *
        scale(vec2(1.0, aspect)) *
        skew(skewX, skewY) *
        scale(vec2(1.0, 1.0 / aspect)) *
        translate(vec2(-0.5));
  } else {
    M =
        scale(vec2(1.0, aspect)) *
        skew(skewX, skewY) *
        scale(vec2(1.0, 1.0 / aspect));
  }

  vec2 q = (inverse(M) * vec3(pos, 1.0)).xy;

  if (q.x >= 0.0 && q.x <= 1.0 &&
      q.y >= 0.0 && q.y <= 1.0) {
    vec3 tex = texture(uTexture, q).rgb;
    color = mix(color, tex, 1.0);
  }

  fragColor = vec4(color, 1.0);
}
