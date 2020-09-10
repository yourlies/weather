interface weather {
  canv: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  recycle: Function;
  particles: Array<particle>;
  updater: Function;
  particleContext: particleContext;
}
interface velocity {
  x: number;
  y: number;
}
interface particle {
  width: number;
  height: number;
  updater: Function;
  recycle?: Function;
  status: string;
  render: Function;
  update: Function;
  chance: number;
  velocity: velocity;
  leans: number;
  alpha: number;
  back: boolean;
  g: number;
  gravity: number;
  increment: number;
  x: number;
  y: number;
  moveX: number;
  moveY: number;
}

interface particleContext {
  width: number;
  height: number;
  leans: number;
  gravity: number;
  updater: Function;
  recycle?: Function;
}
