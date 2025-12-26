#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float uTime;

in vec2 vUv;

out vec4 fragColor;

void main() {
  vec2 uv = vUv;

  // RGBずらし
  vec2 chroma = vec2(0.002, 0.0);
  float r = texture(uTexture, uv + chroma).r;
  float g = texture(uTexture, uv).g;
  float b = texture(uTexture, uv - chroma).b;
  vec3 color = vec3(r, g, b);

  // 黄色がかったレトロ風の色調整
  color *= vec3(1.15, 1.05, 0.85);

  // 静的スキャンライン
  float scan = sin(uv.y * uResolution.y * 0.05) * 0.08;
  color -= scan;

  // 走る走査線
  float speed = 0.25;
  float y = fract(uv.y + uTime * speed);
  float rolling =
      smoothstep(0.47, 0.5, y) -
      smoothstep(0.5, 0.53, y);
  color += rolling * 0.1;

  // ノイズ
  float noise = fract(
    sin(dot(uv * uResolution + uTime, vec2(12.9898, 78.233)))
    * 43758.5453
  );
  color += (noise - 0.5) * 0.05;

  // ビネット効果
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / uResolution.y;
  float v = smoothstep(0.9, 0.3, length(p));
  color *= v;

  fragColor = vec4(color, 1.0);
}
