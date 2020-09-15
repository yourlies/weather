import Weather from './core/Weather';
import Rainy from './core/Rainy';
import Particle from './core/Particle';

declare global {
  interface Window {
    $process: any;
  }
}

window.$process = window.$process || {};
window.$process.Weather = Weather;
window.$process.Rainy = Rainy;
window.$process.Particle = Particle;
