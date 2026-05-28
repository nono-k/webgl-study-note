import { Euler } from '../math/Euler';
import { Mat4 } from '../math/Mat4';
import { Quat } from '../math/Quat';
import { Vec3 } from '../math/Vec3';

export class Transform {
  parent: Transform | null = null;
  children: Transform[] = [];
  visible: boolean;

  matrix: Mat4;
  worldMatrix: Mat4;
  matrixAutoUpdate: boolean;
  worldMatrixNeedsUpdate: boolean;

  position: Vec3;
  scale: Vec3;
  rotation: Euler;
  quaternion: Quat;
  up: Vec3;

  constructor() {
    this.parent = null;
    this.children = [];
    this.visible = true;

    this.matrix = new Mat4();
    this.worldMatrix = new Mat4();
    this.matrixAutoUpdate = true;
    this.worldMatrixNeedsUpdate = false;

    this.position = new Vec3();
    this.scale = new Vec3(1);
    this.rotation = new Euler();
    this.quaternion = new Quat();
    this.up = new Vec3(0, 1, 0);

    this.rotation.onChange = () => this.quaternion.fromEuler(this.rotation, true);
    this.quaternion.onChange = () => this.rotation.fromQuaternion(this.quaternion, undefined, true);
  }

  updateMatrixWorld(force?: boolean) {
    if (this.matrixAutoUpdate) this.updateMatrix();

    if (this.worldMatrixNeedsUpdate || force) {
      if (this.parent === null) {
        this.worldMatrix.copy(this.matrix);
      } else {
        this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);
      }

      this.worldMatrixNeedsUpdate = false;
    }

    for (let i = 0; i < this.children.length; i++) {
      this.children[i].updateMatrixWorld(force);
    }
  }

  updateMatrix() {
    // this.matrix.identity();
    // this.matrix.translate(this.position);
    // this.matrix.scale(this.scale);

    this.matrix.compose(this.quaternion, this.position, this.scale);

    this.worldMatrixNeedsUpdate = true;
  }
}
