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
  {
    name: '陰影付け処理を応用した特殊効果',
    slug: 'shading',
  },
  {
    name: 'ユニークな特殊効果',
    slug: 'unique',
  },
  {
    name: '変形処理',
    slug: 'transform',
  },
  {
    name: '擬似階調',
    slug: 'pseudo-gradation',
  },
  {
    name: '画像合成(明るく)',
    slug: 'image-blend-bright',
  },
  {
    name: '画像合成(暗く)',
    slug: 'image-blend-dark',
  },
  {
    name: 'その他',
    slug: 'other',
  },
];
