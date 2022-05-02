import type * as THREE from 'three';

export abstract class RenderElement {
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh

    abstract update(): void;

    constructor(geometry: THREE.BufferGeometry, material: THREE.Material, mesh: THREE.Mesh) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = mesh;
    }
}