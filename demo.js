const test = function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const canv = document.getElementById("canv");
  canv.setAttribute("width", width);
  canv.setAttribute("height", height);
  const ctx = canv.getContext("2d");
  const particleContext = {
    width: canv.clientWidth,
    height: canv.clientHeight,
    leans: 0.5,
    gravity: 3,
  };
  const drop = new $process.Drop({ canv: canv, ctx: ctx });

  const recycle = function (e) {
    drop.watcher({ x: e.x, y: e.y, forward: 1 });
  };
  const update = function () {
    const particle = new $process.Particle(this.particleContext);
    this.particles.push(particle);
  };
  const weather = new $process.Weather({
    canv,
    ctx,
    particleContext,
    update,
    recycle,
  });
  const rainy = new $process.Rainy(weather);
  const entity = Math.floor((canv.clientWidth * canv.clientHeight) / 120000);

  let frame = 0;
  let sysFrame = 0;
  const lastTimestamp = new Date().getTime();
  const updater = function () {
    if (frame <= 60) {
      frame++;
    }
    if (frame == 60) {
      sysFrame = Math.floor(
        (1000 * 30) / (new Date().getTime() - lastTimestamp)
      );
    }
    ctx.clearRect(0, 0, canv.clientWidth, canv.clientHeight);
    rainy.updater();
    requestAnimationFrame(updater);
    if (weather.particles.length < entity) {
      weather.updater();
    }
    drop.updater(sysFrame);
  };

  window.onmousedown = (e) => {
    drop.watcher({ x: e.x, y: e.y, forward: 1 });
  };

  requestAnimationFrame(updater);
};
test();
