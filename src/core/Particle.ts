import random from '../lib/random';

interface velocity {
  x: number;
  y: number;
}
interface particle {
  width: number;
  height: number;
  updater: Function;
  recycle?: Function;
}

class Particle {
  private width: number;
  private height: number;
  private x: number;
  private y: number;
  private moveX: number;
  private moveY: number;
  private r: number;
  private alpha: number;
  private status: boolean;
  private velocity: velocity;
  private chance: number;
  private updater: Function;
  private recycle: Function;

  public constructor(context: particle) {
    this.width = context.width;
    this.height = context.height;
    this.x = Math.random() * context.width;
    this.y = Math.random() * context.height;
    this.moveX = this.x;
    this.moveY = this.y;
    this.r = random(2, 4);
    this.alpha = random(0.3, 1);
    this.status = false;
    this.velocity = {
      x: random(-0.35, 0.35),
      y: random(0.75, 1.5),
    };
    this.chance = 1;
    this.updater = context.updater;
    this.recycle = context.recycle || function () {};
  }

  public update(): void {
    this.updater();
  }

  public render(): void {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.moveY > this.height) {
      this.recycle(this);
    }
    if (this.moveY > this.height || this.x > this.width) {
      var chance = Math.random();
      if (chance > this.chance) {
        this.x = Math.random() * this.width;
        this.y = 0;
      } else {
        this.x = 0;
        this.y = Math.random() * this.height;
      }
      this.status = false;
    }
  }
}

export default Particle;
