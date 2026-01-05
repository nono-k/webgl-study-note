#version 300 es
precision highp float;

uniform sampler2D uTexture;
uniform vec2 uMove;

in vec2 vUv;
out vec4 fragColor;

// 4点 → 射影行列
mat3 homographyFromQuad(vec2 p0, vec2 p1, vec2 p2, vec2 p3) {
  // p2 → p1の方向
  float dx1 = p1.x - p2.x;
  float dy1 = p1.y - p2.y;
  // p2 → p3の方向
  float dx2 = p3.x - p2.x;
  float dy2 = p3.y - p2.y;
  // 歪み量
  float dx3 = p0.x - p1.x + p2.x - p3.x;
  float dy3 = p0.y - p1.y + p2.y - p3.y;

  // 2つのベクトルの外積(p2を基準にした面積)
  float det = dx1 * dy2 - dx2 * dy1;
  // 射影成分
  float a13 = (dx3 * dy2 - dx2 * dy3) / det;
  float a23 = (dx1 * dy3 - dx3 * dy1) / det;

  return mat3(
    p1.x - p0.x + a13 * p1.x,
    p1.y - p0.y + a13 * p1.y,
    a13,

    p3.x - p0.x + a23 * p3.x,
    p3.y - p0.y + a23 * p3.y,
    a23,

    p0.x,
    p0.y,
    1.0
  );
}

// 同次座標で逆射影変換を行い、w成分で正規化する
vec2 project(mat3 H, vec2 p) {
  vec3 q = inverse(H) * vec3(p, 1.0);
  return q.xy / q.z;
}

void main() {
  vec2 uv = vUv;

  // 余白を取る
  float margin = 0.15;
  vec2 pos = (uv - margin) / (1.0 - 2.0 * margin);

  vec3 color = vec3(0.05);

  // 画像外の背景設定
  if (pos.x < 0.0 || pos.x > 1.0 || pos.y < 0.0 || pos.y > 1.0) {
    fragColor = vec4(color, 1.0);
    return;
  }

  // 4点の初期設定
  vec2 P0 = vec2(0.0, 0.0); // 左下
  vec2 P1 = vec2(1.0, 0.0); // 右下
  vec2 P2 = vec2(1.0, 1.0); // 右上
  vec2 P3 = vec2(0.0, 1.0); // 左上

  // クリックの位置判定(距離が近い点を動かす)
  float sx = step(0.5, uMove.x);
  float sy = step(0.5, uMove.y);

  P0 = mix(P0, uMove, (1.0 - sx) * (1.0 - sy));
  P2 = mix(P2, uMove, sx * sy);
  P1 = mix(P1, uMove, sx  * (1.0 - sy));
  P3 = mix(P3, uMove, (1.0 - sx) * sy );

  // 射影変換
  mat3 H = homographyFromQuad(P0, P1, P2, P3);
  vec2 src = project(H, pos);

  // 座標外の背景色セット
  if (src.x < 0.0 || src.x > 1.0 || src.y < 0.0 || src.y > 1.0) {
    fragColor = vec4(color, 1.0);
    return;
  }

  color = texture(uTexture, src).rgb;
  fragColor = vec4(color, 1.0);
}
