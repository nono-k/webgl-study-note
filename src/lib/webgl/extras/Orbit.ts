import type { Camera } from '../core/Camera';
import type { Mat4 } from '../math/Mat4';

import { Vec2 } from '../math/Vec2';
import { Vec3 } from '../math/Vec3';

export type ZoomStyle = 'dolly' | 'fov';

export interface OrbitOptions {
  element: HTMLElement;
  enabled: boolean;
  target: Vec3;
  ease: number;
  inertia: number;
  enableRotate: boolean;
  rotateSpeed: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
  enableZoom: boolean;
  zoomSpeed: number;
  zoomStyle: ZoomStyle;
  enablePan: boolean;
  panSpeed: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  minDistance: number;
  maxDistance: number;
}

export class Orbit {
  camera: Camera;
  element: HTMLElement;
  enabled: boolean;
  target: Vec3;
  ease: number;
  inertia: number;
  enableRotate: boolean;
  rotateSpeed: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
  enableZoom: boolean;
  zoomSpeed: number;
  zoomStyle: ZoomStyle;
  enablePan: boolean;
  panSpeed: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  minDistance: number;
  maxDistance: number;

  sphericalDelta: { radius: number; phi: number; theta: number };
  sphericalTarget: { radius: number; phi: number; theta: number };
  spherical: { radius: number; phi: number; theta: number };
  panDelta: Vec3;

  rotateStart: Vec2;
  panStart: Vec2;
  dollyStart: Vec2;

  STATE: { NONE: number; ROTATE: number; DOLLY: number; PAN: number; DOLLY_PAN: number };
  state: number;
  mouseButtons: { ORBIT: number; ZOOM: number; PAN: number };

  tempVec3: Vec3;
  tempVec2a: Vec2;
  tempVec2b: Vec2;

  offset: Vec3;

  constructor(camera: Camera, options?: Partial<OrbitOptions>) {
    const {
      element = document.documentElement,
      enabled = true,
      target = new Vec3(),
      ease = 0.25,
      inertia = 0.85,
      enableRotate = true,
      rotateSpeed = 0.1,
      autoRotate = false,
      autoRotateSpeed = 1.0,
      enableZoom = true,
      zoomSpeed = 1,
      zoomStyle = 'dolly',
      enablePan = true,
      panSpeed = 0.1,
      minPolarAngle = 0,
      maxPolarAngle = Math.PI,
      minAzimuthAngle = Number.NEGATIVE_INFINITY,
      maxAzimuthAngle = Number.POSITIVE_INFINITY,
      minDistance = 0,
      maxDistance = Number.POSITIVE_INFINITY,
    } = options ?? {};

    this.camera = camera;
    this.element = element;
    this.enabled = enabled;
    this.target = target;
    this.ease = ease;
    this.inertia = inertia;
    this.enableRotate = enableRotate;
    this.rotateSpeed = rotateSpeed;
    this.autoRotate = autoRotate;
    this.autoRotateSpeed = autoRotateSpeed;
    this.enableZoom = enableZoom;
    this.zoomSpeed = zoomSpeed;
    this.zoomStyle = zoomStyle;
    this.enablePan = enablePan;
    this.panSpeed = panSpeed;
    this.minPolarAngle = minPolarAngle;
    this.maxPolarAngle = maxPolarAngle;
    this.minAzimuthAngle = minAzimuthAngle;
    this.maxAzimuthAngle = maxAzimuthAngle;

    this.minDistance = minDistance;
    this.maxDistance = maxDistance;

    this.sphericalDelta = { radius: 1, phi: 0, theta: 0 };
    this.sphericalTarget = { radius: 1, phi: 0, theta: 0 };
    this.spherical = { radius: 1, phi: 0, theta: 0 };
    this.panDelta = new Vec3();

    this.rotateStart = new Vec2();
    this.panStart = new Vec2();
    this.dollyStart = new Vec2();

    this.STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, DOLLY_PAN: 3 };
    this.state = this.STATE.NONE;
    this.mouseButtons = { ORBIT: 0, ZOOM: 1, PAN: 2 };

    this.tempVec3 = new Vec3();
    this.tempVec2a = new Vec2();
    this.tempVec2b = new Vec2();

    this.offset = new Vec3();
    this.offset.copy(this.camera.position).sub(this.target);
    this.spherical.radius = this.sphericalTarget.radius = this.offset.distance();
    this.spherical.theta = this.sphericalTarget.theta = Math.atan2(this.offset.x, this.offset.z);
    this.spherical.phi = this.sphericalTarget.phi = Math.acos(Math.min(Math.max(this.offset.y / this.sphericalTarget.radius, -1), 1));

    this.addHandlers();
  }

  update() {
    if (this.autoRotate) {
      this.handleAutoRotate();
    }

    this.sphericalTarget.radius *= this.sphericalDelta.radius;
    this.sphericalTarget.theta += this.sphericalDelta.theta;
    this.sphericalTarget.phi += this.sphericalDelta.phi;

    this.sphericalTarget.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.sphericalTarget.theta));
    this.sphericalTarget.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.sphericalTarget.phi));
    this.sphericalTarget.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.sphericalTarget.radius));

    this.spherical.phi += (this.sphericalTarget.phi - this.spherical.phi) * this.ease;
    this.spherical.theta += (this.sphericalTarget.theta - this.spherical.theta) * this.ease;
    this.spherical.radius += (this.sphericalTarget.radius - this.spherical.radius) * this.ease;

    this.target.add(this.panDelta);

    const sinPhiRadius = this.spherical.radius * Math.sin(Math.max(0.000001, this.spherical.phi));
    this.offset.x = sinPhiRadius * Math.sin(this.spherical.theta);
    this.offset.y = this.spherical.radius * Math.cos(this.spherical.phi);
    this.offset.z = sinPhiRadius * Math.cos(this.spherical.theta);

    this.camera.position.copy(this.target).add(this.offset);
    this.camera.lookAt(this.target);

    this.sphericalDelta.theta *= this.inertia;
    this.sphericalDelta.phi *= this.inertia;
    this.panDelta.multiply(this.inertia);

    this.sphericalDelta.radius = 1;
  }

  forcePosition() {
    this.offset.copy(this.camera.position).sub(this.target);
    this.spherical.radius = this.sphericalTarget.radius = this.offset.distance();
    this.spherical.theta = this.sphericalTarget.theta = Math.atan2(this.offset.x, this.offset.z);
    this.spherical.phi = this.sphericalTarget.phi = Math.acos(Math.min(Math.max(this.offset.y / this.sphericalTarget.radius, -1), 1));
    this.camera.lookAt(this.target);
  }

  getZoomScale() {
    return Math.pow(0.95, this.zoomSpeed);
  }

  panLeft(distance: number, m: Mat4) {
    this.tempVec3.set(m[0], m[1], m[2]);
    this.tempVec3.multiply(-distance);
    this.panDelta.add(this.tempVec3);
  }

  panUp(distance: number, m: Mat4) {
    this.tempVec3.set(m[4], m[5], m[6]);
    this.tempVec3.multiply(distance);
    this.panDelta.add(this.tempVec3);
  }

  pan(deltaX: number, deltaY: number) {
    const el = this.element === document.documentElement ? document.body : this.element;
    this.tempVec3.copy(this.camera.position).sub(this.target);

    let targetDistance = this.tempVec3.distance();
    targetDistance *= Math.tan(((this.camera.fov / 2) * Math.PI) / 180);

    this.panLeft((2 * deltaX * targetDistance) / el.clientHeight, this.camera.matrix);
    this.panUp((2 * deltaY * targetDistance) / el.clientHeight, this.camera.matrix);
  }

  dolly(dollyScale: number) {
    if (this.zoomStyle === 'dolly') {
      this.sphericalDelta.radius /= dollyScale;
    } else {
      this.camera.fov /= dollyScale;
      if (this.camera.type === 'orthographic') this.camera.orthographic();
      else this.camera.perspective();
    }
  }

  handleAutoRotate() {
    const angle = ((2 * Math.PI) / 60 / 60) * this.autoRotateSpeed;
    this.sphericalDelta.theta -= angle;
  }

  handleMoveRotate(x: number, y: number) {
    this.tempVec2a.set(x, y);
    this.tempVec2b.sub(this.tempVec2a, this.rotateStart).multiply(this.rotateSpeed);
    const el = this.element === document.documentElement ? document.body : this.element;
    this.sphericalDelta.theta -= (2 * Math.PI * this.tempVec2b.x) / el.clientHeight;
    this.sphericalDelta.phi -= (2 * Math.PI * this.tempVec2b.y) / el.clientHeight;
    this.rotateStart.copy(this.tempVec2a);
  }

  handleMouseMoveDolly(e: MouseEvent) {
    this.tempVec2a.set(e.clientX, e.clientY);
    this.tempVec2b.sub(this.tempVec2a, this.dollyStart);
    if (this.tempVec2b.y > 0) {
      this.dolly(this.getZoomScale());
    } else {
      this.dolly(1 / this.getZoomScale());
    }
    this.dollyStart.copy(this.tempVec2a);
  }

  handleMovePan(x: number, y: number) {
    this.tempVec2a.set(x, y);
    this.tempVec2b.sub(this.tempVec2a, this.panStart).multiply(this.panSpeed);
    this.pan(this.tempVec2b.x, this.tempVec2b.y);
    this.panStart.copy(this.tempVec2a);
  }

  handleTouchStartDollyPan(e: TouchEvent) {
    if (this.enableZoom) {
      const dx = e.touches[0].pageX - e.touches[1].pageX;
      const dy = e.touches[0].pageY - e.touches[1].pageY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.dollyStart.set(0, distance);
    }

    if (this.enablePan) {
      const x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
      const y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
      this.panStart.set(x, y);
    }
  }

  handleTouchMoveDollyPan(e: TouchEvent) {
    if (this.enableZoom) {
      const dx = e.touches[0].pageX - e.touches[1].pageX;
      const dy = e.touches[0].pageY - e.touches[1].pageY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.tempVec2a.set(0, distance);
      this.tempVec2b.set(0, Math.pow(this.tempVec2a.y / this.dollyStart.y, this.zoomSpeed));
      this.dolly(this.tempVec2b.y);
      this.dollyStart.copy(this.tempVec2a);
    }

    if (this.enablePan) {
      const x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
      const y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
      this.handleMovePan(x, y);
    }
  }

  onMouseDown = (e: MouseEvent) => {
    if (!this.enabled) return;

    switch (e.button) {
      case this.mouseButtons.ORBIT:
        if (this.enableRotate === false) return;
        this.rotateStart.set(e.clientX, e.clientY);
        this.state = this.STATE.ROTATE;
        break;
      case this.mouseButtons.ZOOM:
        if (this.enableZoom === false) return;
        this.dollyStart.set(e.clientX, e.clientY);
        this.state = this.STATE.DOLLY;
        break;
      case this.mouseButtons.PAN:
        if (this.enablePan === false) return;
        this.panStart.set(e.clientX, e.clientY);
        this.state = this.STATE.PAN;
        break;
    }

    if (this.state !== this.STATE.NONE) {
      window.addEventListener('mousemove', this.onMouseMove, false);
      window.addEventListener('mouseup', this.onMouseUp, false);
    }
  };

  onMouseMove = (e: MouseEvent) => {
    if (!this.enabled) return;

    switch (this.state) {
      case this.STATE.ROTATE:
        if (this.enableRotate === false) return;
        this.handleMoveRotate(e.clientX, e.clientY);
        break;
      case this.STATE.DOLLY:
        if (this.enableZoom === false) return;
        this.handleMouseMoveDolly(e);
        break;
      case this.STATE.PAN:
        if (this.enablePan === false) return;
        this.handleMovePan(e.clientX, e.clientY);
        break;
    }
  };

  onMouseUp = () => {
    window.removeEventListener('mousemove', this.onMouseMove, false);
    window.removeEventListener('mouseup', this.onMouseUp, false);
    this.state = this.STATE.NONE;
  };

  onMouseWheel = (e: WheelEvent) => {
    if (!this.enabled || !this.enableZoom || (this.state !== this.STATE.NONE && this.state !== this.STATE.ROTATE)) return;
    e.stopPropagation();
    e.preventDefault();

    if (e.deltaY < 0) {
      this.dolly(1 / this.getZoomScale());
    } else if (e.deltaY > 0) {
      this.dolly(this.getZoomScale());
    }
  };

  onTouchStart = (e: TouchEvent) => {
    if (!this.enabled) return;
    e.preventDefault();

    switch (e.touches.length) {
      case 1:
        if (this.enableRotate === false) return;
        this.rotateStart.set(e.touches[0].pageX, e.touches[0].pageY);
        this.state = this.STATE.ROTATE;
        break;
      case 2:
        if (this.enableZoom === false && this.enablePan === false) return;
        this.handleTouchStartDollyPan(e);
        this.state = this.STATE.DOLLY_PAN;
        break;
      default:
        this.state = this.STATE.NONE;
    }
  };

  onTouchMove = (e: TouchEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
    e.stopPropagation();

    switch (e.touches.length) {
      case 1:
        if (this.enableRotate === false) return;
        this.handleMoveRotate(e.touches[0].pageX, e.touches[0].pageY);
        break;
      case 2:
        if (this.enableZoom === false && this.enablePan === false) return;
        this.handleTouchMoveDollyPan(e);
        break;
      default:
        this.state = this.STATE.NONE;
    }
  };

  onTouchEnd = () => {
    if (!this.enabled) return;
    this.state = this.STATE.NONE;
  };

  onContextMenu = (e: MouseEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
  };

  addHandlers() {
    this.element.addEventListener('contextmenu', this.onContextMenu, false);
    this.element.addEventListener('mousedown', this.onMouseDown, false);
    this.element.addEventListener('wheel', this.onMouseWheel, { passive: false });
    this.element.addEventListener('touchstart', this.onTouchStart, { passive: false });
    this.element.addEventListener('touchend', this.onTouchEnd, false);
    this.element.addEventListener('touchmove', this.onTouchMove, { passive: false });
  }

  removeHandlers() {
    this.element.removeEventListener('contextmenu', this.onContextMenu, false);
    this.element.removeEventListener('mousedown', this.onMouseDown, false);
    this.element.removeEventListener('wheel', this.onMouseWheel);
    this.element.removeEventListener('touchstart', this.onTouchStart);
    this.element.removeEventListener('touchend', this.onTouchEnd, false);
    this.element.removeEventListener('touchmove', this.onTouchMove);
    this.element.removeEventListener('mousemove', this.onMouseMove, false);
    this.element.removeEventListener('mouseup', this.onMouseUp, false);
  }
}
