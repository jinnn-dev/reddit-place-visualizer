import type {OrthographicCamera, PerspectiveCamera} from "three";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


export class CameraControl {

    public static FOV = 45;
    public static ASPECT_RATIO = window.innerWidth / window.innerHeight;
    public static NEAR = 1;
    public static FAR = 10000;
    public static Z_POSITION = 5

    selectedCamera: PerspectiveCamera | OrthographicCamera;

    private readonly perspectiveCamera: PerspectiveCamera;
    private readonly orthographicCamera: OrthographicCamera;

    perspectiveOrbitControls: OrbitControls;
    orthographicOrbitControls: OrbitControls;

    constructor(domElement: HTMLElement, width = window.innerWidth, height = window.innerHeight) {
        this.perspectiveCamera = CameraControl.createPerspectiveCamera()
        this.orthographicCamera = CameraControl.createOrthographicCamera(width, height)

        this.perspectiveOrbitControls = new OrbitControls(this.perspectiveCamera, domElement);
        this.orthographicOrbitControls = new OrbitControls(this.orthographicCamera, domElement);

        this.perspectiveOrbitControls.reset()
        this.orthographicOrbitControls.reset()

        // this.perspectiveOrbitControls.minPolarAngle = Math.PI/2;
        // this.perspectiveOrbitControls.maxPolarAngle = Math.PI/2;
        // this.perspectiveOrbitControls.minAzimuthAngle = 0;
        // this.perspectiveOrbitControls.maxAzimuthAngle = 0;

        this.selectedCamera = this.perspectiveCamera;
    }

    update() {
        this.perspectiveOrbitControls.update();
        this.orthographicOrbitControls.update();
    }

    resize() {
        if (this.selectedCamera instanceof THREE.PerspectiveCamera) {
            this.selectedCamera.aspect = window.innerWidth / window.innerHeight;
            this.selectedCamera.updateProjectionMatrix();
        }
    }

    updateFar(far: number) {
        CameraControl.FAR = far;
        this.selectedCamera.far = CameraControl.FAR;
        this.selectedCamera.updateProjectionMatrix();
    }

    updateCameraY(y: number){
        this.selectedCamera.position.y = y;
    }

    private static createPerspectiveCamera() {
        const camera = new THREE.PerspectiveCamera(CameraControl.FOV, CameraControl.ASPECT_RATIO, CameraControl.NEAR, CameraControl.FAR);
        camera.position.z = CameraControl.Z_POSITION;
        camera.position.set(0, 4000, 0);
        camera.up.set(0, 0, -1)
        camera.lookAt(0, 0, 0)
        return camera;
    }

    private static createOrthographicCamera(width: number, height: number) {
        return new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, CameraControl.NEAR, CameraControl.FAR);
    }

    get cameras() {
        return [this.perspectiveCamera, this.orthographicCamera]
    }
}