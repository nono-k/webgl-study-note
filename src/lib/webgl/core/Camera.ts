import { Mat4 } from '../math/Mat4';
import { Vec3 } from '../math/Vec3';
import { Transform } from './Transform';

interface CameraOptions {
  near: number;
  far: number;
  fov: number;
  aspect: number;
  left: number;
  right: number;
  bottom: number;
  top: number;
  zoom: number;
}

interface PerspectiveOptions extends Pick<CameraOptions, 'near' | 'far' | 'fov' | 'aspect'> {}

type CameraType = 'perspective' | 'orthographic';

export class Camera extends Transform {
  projectionMatrix: Mat4;
  viewMatrix: Mat4;
  projectionViewMatrix: Mat4;
  worldPosition: Vec3;

  type: CameraType;

  near: number;
  far: number;
  fov: number;
  aspect: number;
  left?: number;
  right?: number;
  bottom?: number;
  top?: number;
  zoom: number;

  constructor(gl: WebGL2RenderingContext, options?: Partial<CameraOptions>) {
    super();

    const { near = 0.1, far = 100, fov = 45, aspect = 1, left, right, bottom, top, zoom = 1 } = options || {};

    this.near = near;
    this.far = far;
    this.fov = fov;
    this.aspect = aspect;
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
    this.zoom = zoom;

    this.projectionMatrix = new Mat4();
    this.viewMatrix = new Mat4();
    this.projectionViewMatrix = new Mat4();
    this.worldPosition = new Vec3();

    this.type = left || right ? 'orthographic' : 'perspective';

    if (this.type === 'orthographic') {
      this.orthographic();
    } else {
      this.perspective();
    }
  }

  perspective(options?: Partial<PerspectiveOptions>) {
    const { near = this.near, far = this.far, fov = this.fov, aspect = this.aspect } = options || {};

    Object.assign(this, { near, far, fov, aspect });
    this.projectionMatrix.fromPerspective({ fov: fov * (Math.PI / 180), aspect, near, far });
    this.type = 'perspective';
    return this;
  }

  orthographic({
    near = this.near,
    far = this.far,
    left = this.left || -1,
    right = this.right || 1,
    bottom = this.bottom || -1,
    top = this.top || 1,
    zoom = this.zoom,
  } = {}) {
    Object.assign(this, { near, far, left, right, bottom, top, zoom });
    left /= zoom;
    right /= zoom;
    bottom /= zoom;
    top /= zoom;
    this.projectionMatrix.fromOrthogonal({ left, right, bottom, top, near, far });
    this.type = 'orthographic';
    return this;
  }

  updateMatrixWorld() {
    super.updateMatrixWorld();
    this.viewMatrix.inverse(this.worldMatrix);
    this.worldMatrix.getTranslation(this.worldPosition);

    this.projectionViewMatrix.multiply(this.projectionMatrix, this.viewMatrix);
    return this;
  }

  lookAt(target: Vec3) {
    super.lookAt(target, true);
    return this;
  }
}
