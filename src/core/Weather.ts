/// <reference path="../interface.d.ts" />

class Weather {
  public canv: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public particles: Array<particle>;
  public update: Function;
  public particleContext: particleContext;
  public frame: number;
  public recycle: Function;
  private lastTimestamp: number = 0;
  public sysFrame: number = 0;
  constructor(context: weather) {
    this.canv = context.canv;
    this.ctx = context.ctx;
    this.particles = [];
    this.update = context.update;
    this.particleContext = context.particleContext;
    this.frame = 0;
    this.recycle = context.recycle || function () { };
  }
  public updater() {
    if (this.frame >= 60 && this.sysFrame == 0) {
      this.sysFrame = Math.floor(1000 * 30 / (new Date().getTime() - this.lastTimestamp));
    }
    if (this.sysFrame > 0 && this.frame >= Math.floor(this.sysFrame) / 2) {
      this.update();
      this.frame = 0;
    }
    if (this.frame == 0) {
      this.lastTimestamp = new Date().getTime()
    }
    this.frame++;
  }
}

export default Weather;
