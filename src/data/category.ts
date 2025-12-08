import type { glslCategory, webglCategory } from '@/types/config';

export const webglCategoryList: webglCategory[] = [{ name: 'Basic', slug: 'basic' }];

export const glslCategoryList: glslCategory[] = [
  {
    name: '色調変換を用いたエフェクト処理',
    slug: 'color-tone-conversion',
  },
  {
    name: '空間フィルタリング',
    slug: 'spatial-filtering',
  },
  {
    name: 'エッジ摘出',
    slug: 'edge-extraction',
  },
  {
    name: 'ブラー処理',
    slug: 'blur',
  },
];
