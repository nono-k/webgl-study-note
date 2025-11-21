import type { glslCategory, webglCategory } from '@/types/config';

export const webglCategoryList: webglCategory[] = [{ name: 'Basic', slug: 'basic' }];

export const glslCategoryList: glslCategory[] = [
  {
    name: 'Image Processing',
    slug: 'image-processing',
    subCategory: ['色調変換を用いたエフェクト処理'],
  },
];
