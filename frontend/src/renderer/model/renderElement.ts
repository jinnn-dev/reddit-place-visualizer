import type * as THREE from 'three';

export abstract class RenderElement {
  abstract update(): void;

  constructor(public geometry: THREE.BufferGeometry, public material: THREE.MeshBasicMaterial | THREE.PointsMaterial, public mesh: THREE.Mesh) {
    this.geometry = geometry;
    this.material = material;
    this.mesh = mesh;
  }
}
