import { RenderElement } from './renderElement';

import * as THREE from 'three'

export class Cube extends RenderElement {

    constructor(width: number, height:number, color: number, widthSegments = 1, heightSegments = 1, depthSegments = 1) {
        const geometry = new THREE.BoxGeometry(
            width,
            height,
            widthSegments,
            heightSegments,
            depthSegments
        );
        const material = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true
        })
        const mesh = new THREE.Mesh(geometry, material);

        super(geometry, material, mesh)
    }

    update() {}
}