const test = function () {
  const canv = document.getElementById("canv");
  const ctx = canv.getContext("2d");
  const particleContext = {
    width: canv.clientWidth,
    height: canv.clientHeight,
    leans: 0.5,
    gravity: 3,
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
  });
  const rainy = new $process.Rainy(weather);
  const entity = Math.floor((canv.clientWidth * canv.clientHeight) / 18000);

  const updater = function () {
    ctx.clearRect(0, 0, canv.clientWidth, canv.clientHeight);
    rainy.updater();
    requestAnimationFrame(updater);
    if (weather.particles.length < entity) {
      weather.updater();
    }
  };
  requestAnimationFrame(updater);
};
test();
