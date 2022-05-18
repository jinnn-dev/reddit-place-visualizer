interface FrameProperties {
  count: number;
  start: number;
  last: number;
  time: number;
  delta: number;
}

export class RenderLoop {
  public static DEFAULT_TICKS = 1000;
  public static MAX_TICKS = 10000;

  private readonly callback: (time: number) => void;
  private currTime;
  ticks;
  private isRunning;
  private animationFrameId = 0;

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
    };
  }

  start() {
    if (this.isRunning) return this;
    this.isRunning = true;

    this.frameProperties.start = performance.now();
    this.frameProperties.last = this.frameProperties.start;
    this.loop();
  }

  stop() {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrameId);
  }

  togglePlay() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.resume();
    }
  }

  pause() {
    if (this.isRunning) {
      this.isRunning = false;
    }
  }

  resume() {
    if (!this.isRunning) {
      this.isRunning = true;
    }
  }

  private loop() {
    this.frameProperties.time = performance.now();
    if (this.isRunning) {
      this.frameProperties.count++;
      this.frameProperties.delta = (this.frameProperties.time - this.frameProperties.last) * this.ticks;

      this.currTime += this.frameProperties.delta;
    }
    this.callback(this.currTime);
    this.frameProperties.last = this.frameProperties.time;

    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  public updateCurrTime(newTime: number) {
    this.currTime = newTime;
  }
}
