/// <reference path="../interface.d.ts" />

class Weather {
  public canv: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public particles: Array<particle>;
  public update: Function;
  public particleContext: particleContext;
  public frame: number;
  private lastTimestamp: number = 0;
  constructor(context: weather) {
    this.canv = context.canv;
    this.ctx = context.ctx;
    this.particles = [];
    this.update = context.update;
    this.particleContext = context.particleContext;
    this.frame = 0;
  }
  public updater() {
    if (this.frame == 0) {
      this.lastTimestamp = new Date().getTime()
    }
    if (this.frame >= 60) {
      console.log(new Date().getTime() - this.lastTimestamp)
      this.update();
      this.frame = 0;
    }
    this.frame++;
  }
}

export default Weather;
