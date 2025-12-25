#version 300 es
precision mediump float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform float strength;

in vec2 vUv;

out vec4 fragColor;

// 簡易ノイズ
float rand(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  vec2 pos = 1.0 / uResolution;

  // ピクセル単位でランダムにずらす
  vec2 offset = vec2(rand(uv), rand(uv + 10.0)) - 0.5;

  vec3 color = texture(uTexture, uv + offset * pos * strength).rgb;
  fragColor = vec4(color, 1.0);
}
