import Weather from './core/Weather.js';
import Rainy from './core/Rainy.js';
import Particle from './core/Particle.js';

declare global {
  interface Window {
    $process: any;
  }
}

window.$process = window.$process || {};
window.$process.Weather = Weather;
window.$process.Rainy = Rainy;
window.$process.Particle = Particle;

console.log(window.$process)