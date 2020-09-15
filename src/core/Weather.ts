/// <reference path="../interface.d.ts" />

class Weather {
  public canv: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public particles: Array<particle>;
  public update: Function;
  public particleContext: particleContext;
  public frame: number;
  constructor(context: weather) {
    this.canv = context.canv;
    this.ctx = context.ctx;
    this.particles = [];
    this.update = context.updater;
    this.particleContext = context.particleContext;
    this.frame = 0;
  }
  public updater() {
    if (this.frame >= 60) {
      this.update(this.particleContext);
      this.frame = 0;
    }
    this.frame++;
  }
}

export default Weather;
