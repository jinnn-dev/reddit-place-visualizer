interface FrameProperties {
    count: number;
    start: number;
    last: number;
    time: number;
    delta: number;
}

export class RenderLoop {
    private callback: (time: number) => void;
    private currTime;
    private ticks;
    private isRunning;

    private frameProperties: FrameProperties;

    constructor(callback: (time: number) => void) {
        this.callback = callback;
        this.currTime = 0;
        this.ticks = 1000;
        this.isRunning = false;

        this.frameProperties = {
            count: 0,
            start: performance.now(),
            last: performance.now(),
            time: 0,
            delta: 0
        }
    }

    start() {
        if (this.isRunning) return this;
        this.isRunning = true;

        this.frameProperties.start = performance.now();
        this.frameProperties.last = this.frameProperties.start;
        this.loop()
    }

    public loop() {
        this.frameProperties.count++;
        this.frameProperties.time = performance.now();
        this.frameProperties.delta = (this.frameProperties.time - this.frameProperties.last) * this.ticks;

        this.currTime += this.frameProperties.delta;
        this.callback(this.currTime);
        this.frameProperties.last = this.frameProperties.time;
        requestAnimationFrame(this.loop.bind(this));
    }
}