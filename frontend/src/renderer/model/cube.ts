import {RenderElement} from './renderElement';

import * as THREE from 'three';

export class Cube extends RenderElement {
    constructor(width: number, height: number, depth: number, color: number, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
        const geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: false
        });
        const mesh = new THREE.Mesh(geometry, material);

        super(geometry, material, mesh);
    }

    setPosition(x: number, z: number) {
        this.mesh.position.x = x;
        this.mesh.position.z = z;
    }

    update() {
    }
}
