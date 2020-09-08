interface weather {
  canv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  recycle: Function;
  particles: Array<any>;
}
class Rainy {
  private canv: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private recycle: Function;
  private particles: Array<any>;
  private weather: weather;

  constructor(weather: weather) {
    this.canv = weather.canv;
    this.ctx = weather.ctx;
    this.recycle = weather.recycle;
    this.particles = weather.particles;
    this.weather = weather;
  }
}
