import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import type { RenderElement } from './model/renderElement';

export class Renderer {
  public static FOV = 45;
  public static ASPECT_RATIO = window.innerWidth / window.innerHeight;
  public static NEAR = 1;
  public static FAR = 1000;
  public static Z_POSITION = 5;

  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  perspectiveOrbitControls: OrbitControls;
  orthographicOrbitControls: OrbitControls;
  perspectiveCamera: THREE.PerspectiveCamera;
  orthographicCamera: THREE.OrthographicCamera;
  selectedCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  elements: RenderElement[];

  constructor(parentElement: HTMLElement) {
    this.elements = [];

    this.renderer = createRenderer(parentElement);
    this.scene = createScene();

    this.perspectiveCamera = createPerspectiveCamera();
    this.orthographicCamera = createOrthographicCamera();

    this.scene.add(new THREE.GridHelper());

    this.scene.add(this.perspectiveCamera, this.orthographicCamera);

    this.changeCamera(this.perspectiveCamera);

    this.perspectiveOrbitControls = createOrbitControls(this.perspectiveCamera, this.renderer.domElement);
    this.orthographicOrbitControls = createOrbitControls(this.orthographicCamera, this.renderer.domElement);

    this.perspectiveOrbitControls.reset();
    this.orthographicOrbitControls.reset();
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.perspectiveOrbitControls.update();
    this.orthographicOrbitControls.update();

    for (const renderElement of this.elements) {
      renderElement.update();
    }

    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.selectedCamera);
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

  changeCamera(camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) {
    this.selectedCamera = camera;
  }

  toggleCamera() {
    if (this.selectedCamera instanceof THREE.PerspectiveCamera) {
      this.changeCamera(this.orthographicCamera);
    } else {
      this.changeCamera(this.perspectiveCamera);
    }
  }

  handleResize() {
    window.addEventListener('resize', this.onResize, false);
  }

  private onResize() {
    if (this.selectedCamera instanceof THREE.PerspectiveCamera) {
      this.selectedCamera.aspect = window.innerWidth / window.innerHeight;
      this.selectedCamera.updateProjectionMatrix();
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }
}

export function createRenderer(parentElement: HTMLElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  parentElement.appendChild(renderer.domElement);
  return renderer;
}

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  return scene;
}

// export function createCamera(isPerspective = true, width = window.innerWidth, height = window.innerHeight) {
//   if (isPerspective) {
//     return new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//   }
//   return new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
// }

export function createPerspectiveCamera(width = window.innerWidth, height = window.innerHeight) {
  const camera = new THREE.PerspectiveCamera(Renderer.FOV, Renderer.ASPECT_RATIO, Renderer.NEAR, Renderer.FAR);
  camera.position.z = Renderer.Z_POSITION;
  return camera;
}

export function createOrthographicCamera(width = window.innerWidth, height = window.innerHeight) {
  return new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, Renderer.NEAR, Renderer.FAR);
}

export function createOrbitControls(camera: THREE.Camera, domElement: HTMLElement) {
  return new OrbitControls(camera, domElement);
}
