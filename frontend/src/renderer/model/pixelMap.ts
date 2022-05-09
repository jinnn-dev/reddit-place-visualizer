import {
    BufferAttribute,
    BufferGeometry,
    Color, DoubleSide,
    Float32BufferAttribute,
    Mesh, MeshBasicMaterial, MeshStandardMaterial,
    Points,
    PointsMaterial,
    Scene,
    Vector3,
} from 'three';
import {generateData} from '../mock-data';
import type {Cube} from './cube';
import type {PixelData} from "@/model/pixelData";
import {mergeBufferGeometries} from 'three/examples/jsm/utils/BufferGeometryUtils';

export class PixelMap {

    private canvasWidth = 2000;
    private canvasHeight = 2000;

    private canvas: Map<string, Cube>

    points: Points | undefined

    pixelMesh: Mesh | undefined;

    constructor(public size: number) {
        this.canvas = new Map<string, Cube>()
    }

    generate() {
        const data = generateData()
        const geometry = new BufferGeometry();

        const positions = []
        const colors = []

        for (const item of data) {
            // const pixel = new Cube(this.size, this.size, this.size, new Color(parseInt(item.pixel_color.replace("#", "0x"), 16)).getHex());
            // pixel.setPosition(
            //     item.x * this.size - (this.canvasWidth * this.size / 2),
            //     item.y * this.size - (this.canvasHeight * this.size / 2)
            // );
            // this.canvas.set("" + item.x + item.y, pixel)
            const x = item.x * this.size - (this.canvasWidth * this.size / 2)
            const y = item.y * this.size - (this.canvasHeight * this.size / 2)
            positions.push(x, 0, y);
            const color = new Color(parseInt(item.pixel_color.replace("#", "0x"), 16))
            colors.push(color.r, color.g, color.b)
        }

        geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

        geometry.computeBoundingSphere();
        geometry.lookAt(new Vector3(0, 0, 0))

        const material = new PointsMaterial({
            size: 2.5 * this.size,
            vertexColors: true
        })
        this.points = new Points(geometry, material);
        // this.points = new Mesh(geometry, material)
        // this.points.matrixAutoUpdate = false

    }

    generateMeshes() {
        const generationStart = performance.now()
        const pixelData = generateData()
        console.log("Generation took:", performance.now() - generationStart)

        const mesh1 = this.generateMeshChunk(pixelData.slice(1000000))
        const mesh2 = this.generateMeshChunk(pixelData.slice(1000001, 2000000))
        const mesh3 = this.generateMeshChunk(pixelData.slice(2000001, 3000000))
        const mesh4 = this.generateMeshChunk(pixelData.slice(3000001, 4000000))

        return [mesh1, mesh2, mesh3, mesh4]
    }

    generateGeometries(amount = 2) {
        if (amount % 2 !== 0) {
            throw new Error("Is not divisible by 2")
        }

        const data = generateData(2000);

        const totalPixels = this.canvasWidth * this.canvasHeight;
        const chunkSize = totalPixels / amount;

        const geometries: BufferGeometry[] = [];

        for (let i = 0; i < totalPixels; i += chunkSize) {
            const vertices = new Array(chunkSize);
            const colors = new Array(chunkSize);
            const geometry = new BufferGeometry()
            this.processChunk(data.slice(i + 1, i + chunkSize), vertices, colors);
            geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
            // geometry.computeBoundingSphere()
            geometries.push(geometry)
        }

        return geometries;
    }

    async generatePixelMap() {
        const geometry = mergeBufferGeometries(this.generateGeometries(2))
        const material = new MeshBasicMaterial({side: DoubleSide, vertexColors: true, wireframe: true})
        this.pixelMesh = new Mesh(geometry, material)
    }

    updatePixelMap(x: number, y: number) {
        if (!this.pixelMesh) return;
        console.log(this.pixelMesh.geometry.attributes.color.count)
        const startIndexIndex = x + y * this.canvasWidth;
        for (let i = 0; i < 12; i++) {
            console.log(startIndexIndex + i)
            this.pixelMesh.geometry.attributes.color.setXYZ(startIndexIndex + i, 0, 0, 0)
        }
        this.pixelMesh!.geometry.attributes.color.needsUpdate = true;
    }


    generateMeshChunk(data: PixelData[]) {
        const vertices: number[] = new Array(1000000)
        const colors: number[] = new Array(1000000)

        this.processChunk(data, vertices, colors);

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))

        const material = new MeshBasicMaterial({side: DoubleSide, vertexColors: true})
        return new Mesh(geometry, material)
    }

    generateMesh() {
        const startGenerating = performance.now()
        const pixelData = generateData()
        console.log("Generating new data needed: ", performance.now() - startGenerating)

        console.log(pixelData.length)


        const renderingStart = performance.now()

        const geometry = new BufferGeometry();

        const vertices: number[] = new Array(4000000)
        const colors: number[] = new Array(4000000)

        this.processChunk(pixelData.slice(0, 10000), vertices, colors)

        // this.processChunk(pixelData.slice(0, 1000000), vertices, colors);
        // this.processChunk(pixelData.slice(1000001, 2000000), vertices, colors);
        // this.processChunk(pixelData.slice(2000001, 3000000), vertices, colors);
        // this.processChunk(pixelData.slice(3000001, 4000000), vertices, colors);
        // // this.processChunk(pixelData.slice(0, 100000), vertices, colors);
        //
        //
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
        const material = new MeshBasicMaterial({side: DoubleSide, vertexColors: true});

        console.log("Creating mesh took: ", performance.now() - renderingStart)

        //
        // const loader = new GLTFLoader()
        //
        // const start = performance.now()
        // const loadedData = await loader.loadAsync('/untitled.glb');
        //
        //
        // console.log(performance.now() - start)
        // const object = loadedData.scene.children[0] as Mesh
        // object.scale.set(200, 200, 200)
        // const mesh = loadedData.scene.children[0] as Mesh
        // let colors = []
        //
        // for (let i = 0; i < 4840000; i++) {
        //
        //     const r = Math.random()
        //     const g = Math.random()
        //     const b = Math.random()
        //     colors.push(
        //         r, g, b,
        //         r, g, b,
        //         r, g, b,
        //
        //         r, g, b,
        //         r, g, b,
        //         r, g, b
        //
        //     )
        // }
        // mesh.geometry = mesh.geometry.toNonIndexed()
        // mesh.geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
        // mesh.material = new MeshBasicMaterial({wireframe: false, vertexColors: true, side: DoubleSide})
        // console.log(mesh.geometry.getAttribute('position'))
        // console.log(mesh.geometry.getAttribute('color'))

        return new Mesh(geometry, material)
    }

    processChunk(chunk: PixelData[], vertices: number[], colors: number[]) {
        const halfWidth = this.canvasWidth / 2;
        const halfHeight = this.canvasHeight / 2;
        const offset = this.size / 2;
        let curVerticesIndex = 0;
        let curColorIndex = 0;
        const size = this.size

        const startTime = performance.now()
        for (let i = 0; i < chunk.length; i++) {

            const x = chunk[i].x * size - halfWidth
            const y = chunk[i].y * size - halfHeight

            const topLeftX = x - offset
            const topLeftY = y - offset

            const topRightX = x + offset
            const topRightY = y - offset

            const bottomLeftX = x - offset
            const bottomLeftY = y + offset

            const bottomRightX = x + offset
            const bottomRightY = y + offset
            const height = 0

            vertices[curVerticesIndex] = topLeftX
            vertices[curVerticesIndex + 1] = 0
            vertices[curVerticesIndex + 2] = topLeftY

            vertices[curVerticesIndex + 3] = topRightX
            vertices[curVerticesIndex + 4] = 0
            vertices[curVerticesIndex + 5] = topRightY

            vertices[curVerticesIndex + 6] = bottomRightX
            vertices[curVerticesIndex + 7] = height
            vertices[curVerticesIndex + 8] = bottomRightY

            vertices[curVerticesIndex + 9] = bottomRightX
            vertices[curVerticesIndex + 10] = height
            vertices[curVerticesIndex + 11] = bottomRightY

            vertices[curVerticesIndex + 12] = bottomLeftX
            vertices[curVerticesIndex + 13] = height
            vertices[curVerticesIndex + 14] = bottomLeftY

            vertices[curVerticesIndex + 15] = topLeftX
            vertices[curVerticesIndex + 16] = height
            vertices[curVerticesIndex + 17] = topLeftY

            curVerticesIndex += 18

            const {r, g, b} = this.hexToRGB(chunk[i].pixel_color);

            colors[curColorIndex] = r
            colors[curColorIndex + 1] = g
            colors[curColorIndex + 2] = b

            colors[curColorIndex + 3] = r
            colors[curColorIndex + 4] = g
            colors[curColorIndex + 5] = b

            colors[curColorIndex + 6] = r
            colors[curColorIndex + 7] = g
            colors[curColorIndex + 8] = b

            colors[curColorIndex + 9] = r
            colors[curColorIndex + 10] = g
            colors[curColorIndex + 11] = b

            colors[curColorIndex + 12] = r
            colors[curColorIndex + 13] = g
            colors[curColorIndex + 14] = b

            colors[curColorIndex + 15] = r
            colors[curColorIndex + 16] = g
            colors[curColorIndex + 17] = b

            curColorIndex += 18
        }

        console.log(performance.now() - startTime)
    }

    async updateColors() {

    }

    updatePixel(x: number, y: number, color: number) {
        this.canvas.get("" + x + y)?.material.color.setHex(color);
    }

    hexToRGB(hex: string) {
        // console.log(hex)
        // const parsed = parseInt(hex.slice(1), 16);
        // let r = parsed >> 16;
        // let g = parsed >> 8 & 0xFF;
        // let b = parsed & 0xFF;
        // return [r, g, b];
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
        return {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        };
    }

    get elements() {
        return Array.from(this.canvas.values());
    }


}
