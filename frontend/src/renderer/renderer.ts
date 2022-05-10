import type {RenderElement} from './model/renderElement';
import {CameraControl} from "@/renderer/cameraControl";
import {Color, GridHelper, HemisphereLight, Mesh, Object3D, Points, Scene, Vector3, WebGLRenderer} from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {Sky} from "three/examples/jsm/objects/Sky";

export class Renderer {


    renderer: WebGLRenderer;
    scene: Scene;

    elements: RenderElement[];
    cameraControl: CameraControl;

    stats: any;

    constructor(parentElement: HTMLElement, debug = false) {
        this.elements = [];

        this.renderer = createRenderer(parentElement);
        this.scene = new Scene();

        this.cameraControl = new CameraControl(this.renderer.domElement);

        if (debug) {
            this.scene.add(new GridHelper(2000));
        }

        this.stats = Stats()
        parentElement.appendChild(this.stats.dom)
        this.scene.add(...this.cameraControl.cameras)


        // const sky = new Sky()
        // sky.scale.setScalar(450000)
        // this.addObject(sky)
        // this.scene.background = new Color('#f7edff')
        // const sun = new Vector3()
        //
        // const effectController = {
        //     turbidity: 10,
        //     rayleigh: 3,
        //     mieCoefficient: 0.005,
        //     mieDirectionalG: 0.7,
        //     inclination: 0.49, // elevation / inclination
        //     azimuth: 0.25, // Facing front,
        //     exposure: this.renderer.toneMappingExposure
        // }
        //
        // const uniforms = sky.material.uniforms
        // uniforms['turbidity'].value = effectController.turbidity
        // uniforms['rayleigh'].value = effectController.rayleigh
        // uniforms['mieCoefficient'].value = effectController.mieCoefficient
        // uniforms['mieDirectionalG'].value = effectController.mieDirectionalG
        //
        // const theta = Math.PI * (effectController.inclination - 0.5)
        // const phi = 2 * Math.PI * (effectController.azimuth - 0.5)
        //
        // sun.x = Math.cos(phi)
        // sun.y = Math.sin(phi) * Math.sin(theta)
        // sun.z = Math.sin(phi) * Math.cos(theta)
        //
        // uniforms['sunPosition'].value.copy(sun)
        //
        // this.renderer.toneMappingExposure = effectController.exposure

    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.cameraControl.update()

        for (const renderElement of this.elements) {
            renderElement.update();
        }

        this.render();

        this.stats.update()
    }

    render() {
        this.renderer.render(this.scene, this.cameraControl.selectedCamera);
    }

    addElement(element: RenderElement) {
        this.elements.push(element);
        this.scene.add(element.mesh);
    }

    addElements(elements: RenderElement[]) {
        this.elements.push(...elements);
        const meshes = elements.map((element) => element.mesh);
        this.scene.add(...meshes);
    }

    addMesh(mesh: Mesh) {
        this.scene.add(mesh)
    }

    addObject(object: Object3D) {
        this.scene.add(object)
    }

    addPoint(point: Points) {
        this.scene.add(point)
    }

    handleResize() {
        window.addEventListener('resize', this.onResize, false);
    }

    private onResize() {
        this.cameraControl.resize()
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render();
    }
}

export function createRenderer(parentElement: HTMLElement): WebGLRenderer {
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    parentElement.appendChild(renderer.domElement);
    return renderer;
}
