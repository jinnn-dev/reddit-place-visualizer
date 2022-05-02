import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { RenderElement } from './model/renderElement';

export class Renderer {
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    orbitControls: OrbitControls
    camera: THREE.Camera

    elements: RenderElement[]

    constructor(parentElement: HTMLElement, isPerspective = true) {
        this.elements = []

        this.renderer = createRenderer(parentElement)
        this.scene = createScene()

        this.camera = createCamera(isPerspective, 20, 20)
        this.camera.position.z = 2
        this.orbitControls = createOrbigControls(this.camera, this.renderer.domElement)        
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.orbitControls.update();

        for (const renderElement of this.elements) {
            renderElement.update()
        }

        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }

    addElement(element: RenderElement) {
        this.elements.push(element)
        this.scene.add(element.mesh)
    }

    handleResize() {
        window.addEventListener('resize', this.onResize, false)
    }

    private onResize() {
        if (this.camera instanceof THREE.PerspectiveCamera ) {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
        }
        
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.render()
    }

}

export function createRenderer(parentElement: HTMLElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight);
    parentElement.appendChild(renderer.domElement);
    return renderer;
}

export function createScene(): THREE.Scene {
    const scene = new THREE.Scene()
    return scene
}

export function createCamera(isPerspective = true, width = window.innerWidth, height = window.innerHeight ) {
    if (isPerspective) {
        return new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)

    }
    return new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
}

export function createOrbigControls(camera: THREE.Camera, domElement: HTMLElement) {
    return new OrbitControls(camera, domElement);
}