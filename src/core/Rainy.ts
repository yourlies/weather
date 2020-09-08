interface weather {
  canv: Element;
  ctx: Element;
  recycle: Function;
  particles: Array<any>;
}
class Rainy {
  private canv: Element;
  private ctx: Element;
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
