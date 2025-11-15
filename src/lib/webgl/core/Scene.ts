import type { Mesh } from './Mesh';
import { Transform } from './Transform';

export class Scene extends Transform {
  parent: Scene | null = null;
  children: Scene[] = [];

  add(child: Scene) {
    if (child.parent) child.parent.remove(child);
    child.parent = this;
    this.children.push(child);
  }

  remove(child: Scene) {
    const i = this.children.indexOf(child);
    if (i !== -1) {
      child.parent = null;
      this.children.splice(i, 1);
    }
  }

  traverse(callback: (scene: Scene) => void) {
    callback(this);
    for (const child of this.children) {
      child.traverse(callback);
    }
  }
}
