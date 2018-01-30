(function () {
  var Nature = {};
  Nature.scene = document.getElementById('canv');
  Nature.camera = Nature.scene.getContext('2d');
  Nature.entity = 100;
  Nature.particles = [];
  Nature.time = 0;
  Nature.width = window.innerWidth;
  Nature.height = window.innerHeight;
  Nature.Fps = 60;

  var Tool = {};
  Tool.random = function (min, max) {
    return Math.random() * (max - min) + min
  }

  window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.oRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function (callBack) {
        window.setTimeout(callBack, 1000 / Nature.Fps)
      }
  })();

  window.cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame || window.clearTimeout;
  })();

  var Particle = function () {
    this.x = Math.random() * Nature.width;
    this.y = Math.random() * Nature.height;
    this.r = Tool.random(1, 5);
    this.alpha = Tool.random(0.3, 1)
    this.velocity = {
      x: Tool.random(-0.35, 0.35),
      y: Tool.random(0.75, 1.5)
    }
  }

  Particle.prototype.update = function () {
    Nature.camera.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')';
    Nature.camera.beginPath();
    Nature.camera.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    Nature.camera.closePath();
    Nature.camera.fill();
  }
  Particle.prototype.render = function () {
    Nature.time += 0.016;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.y > Nature.scene.height) {
      this.x = Math.random() * Nature.scene.width;
      this.y = 0;
    }
  }


  var snowy = function () {
    Nature.camera.clearRect(0, 0, Nature.scene.width, Nature.scene.height);
    for (var i = 0; i < Nature.particles.length; i++) {
      var particle = Nature.particles[i];
      particle.render();
      particle.update();
    }
    requestAnimationFrame(snowy);
  }

  var weatherId;
  var frame = 0;
  var weather = function () {
    frame++;
    if (frame >= 60) {
      frame = 0;
      var particle = new Particle();
      Nature.particles.push(particle);
    }
    if (Nature.particles.length >= Nature.entity) {
      cancelAnimationFrame(weatherId);
    } else {
      weatherId = requestAnimationFrame(weather);
    }
  }

  Nature.scene.width = Nature.width;
  Nature.scene.height = Nature.height;
  weather();
  snowy();
})();