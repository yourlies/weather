/// <reference path="../interface.d.ts" />
import random from '../lib/random';

class Particle implements particle {
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public moveX: number;
  public moveY: number;
  public r: number;
  public alpha: number;
  public status: string;
  public velocity: velocity;
  public chance: number;
  public updater: Function;
  public recycle: Function;
  public leans: number;
  public g: number;
  public gravity: number;
  public back: boolean;
  public increment: number;

  public constructor(context: particle) {
    this.width = context.width;
    this.height = context.height;
    this.leans = context.leans;
    this.gravity = context.gravity;
    this.g = context.gravity;
    this.increment = 0;
    this.back = false;
    this.x = Math.random() * context.width;
    this.y = Math.random() * context.height;
    this.moveX = this.x;
    this.moveY = this.y;
    this.r = random(2, 4);
    this.alpha = random(0.3, 1);
    this.status = '';
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
      const chance = Math.random();
      if (chance > this.chance) {
        this.x = Math.random() * this.width;
        this.y = 0;
      } else {
        this.x = 0;
        this.y = Math.random() * this.height;
      }
      this.status = '';
    }
  }
}

export default Particle;
