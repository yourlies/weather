/// <reference path="../interface.d.ts" />

class Rainy {
  canv: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private recycle: Function;
  private particles: Array<particle>;
  private weather: weather;

  constructor(weather: weather) {
    this.canv = weather.canv;
    this.ctx = weather.ctx;
    this.recycle = weather.recycle;
    this.particles = weather.particles;
    this.weather = weather;
  }

  public updater() {
    if (this.particles.length <= 0) {
      this.weather.updater();
    }
    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      if (particle.status != 'rainy') {
        this.RainyAdapt(particle);
        this.RainyLayer(particle);
      }
      particle.render(this.recycle);
      this.RainyUpdater(particle);
    }
  }

  public RainyAdapt(particle: particle) {
    if (particle.height * particle.leans > particle.height) {
      particle.chance = (particle.width / particle.leans / particle.height) * 0.5;
    } else {
      particle.chance = ((particle.height * particle.leans) / particle.width) * 0.5;
    }
    const vy = 12 + Math.random() * 5
    particle.velocity.y = Math.floor(vy * 60 / this.weather.sysFrame);
    particle.velocity.x = particle.velocity.y * particle.leans;
    particle.alpha = 0.1;
    particle.status = 'rainy';
    particle.back = false;
  }
  public RainyLayer(particle: particle) {
    var rate = Math.random();
    switch (true) {
      case rate > 0.66:
        particle.increment = 55;
        break;
      case rate > 0.33:
        particle.increment = 50;
        particle.velocity.y = particle.velocity.y * 0.8;
        particle.g = particle.gravity * 0.8;
        break;
      default:
        particle.increment = 40;
        particle.velocity.y = particle.velocity.y * 0.6;
        particle.g = particle.gravity * 0.6;
        particle.alpha = particle.alpha * 0.6;
        break;
    }
  }
  public RainyUpdater(particle: particle) {
    this.ctx.beginPath();
    this.ctx.moveTo(particle.x, particle.y);
    const frame = this.weather.sysFrame || 60
    particle.velocity.y += (1 / frame) * particle.g;
    particle.velocity.x = particle.velocity.y * particle.leans;
    var t = Math.atan(particle.velocity.y / particle.velocity.x);
    var x = Math.cos(t) * particle.increment;
    var y = Math.sin(t) * particle.increment;
    this.ctx.lineTo(particle.x + x, particle.y + y);

    particle.moveX = particle.x + x;
    particle.moveY = particle.y + y;
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = 'rgba(0, 0, 0, ' + particle.alpha + ')';
    this.ctx.stroke();
    this.ctx.closePath();
  }
}

export default Rainy;
