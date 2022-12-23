const test = function () {
  const canv = document.getElementById('canv');
  const ctx = canv.getContext('2d');
  const particleContext = {
    width: canv.width,
    height: canv.height,
    leans: 0.5,
    gravity: 6,
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

  const updater = function () {
    ctx.clearRect(0, 0, canv.width, canv.height)
    rainy.updater();
    requestAnimationFrame(updater);
    if (weather.particles.length < 3) {
      weather.updater();
    }
  };
  requestAnimationFrame(updater);
}
test()