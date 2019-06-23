(function () {
  var Nature = {};
  Nature.scene = document.getElementById('canv');
  Nature.camera = Nature.scene.getContext('2d');
  Nature.entity = 60;
  Nature.particles = [];
  Nature.time = 0;
  Nature.width = window.innerWidth;
  Nature.height = window.innerHeight;
  Nature.FPS = 60;
  Nature.g = 15;

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
        window.setTimeout(callBack, 1000 / Nature.FPS)
      }
  })();

  window.cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame || window.clearTimeout;
  })();

  var getTwoLineDistance = function (lineA, lineB) {
    var k = (lineA.y0 - lineA.y1) / (lineA.x0 - lineA.x1);
    var b = lineA.y0 - k * lineA.x0;
    var d = Math.abs(k * lineB.x0 + -1 * lineB.y0 + b) / Math.sqrt(k * k + 1);
    var isOverlapped = false;
    if ((lineA.x0 < lineB.x0) && (lineA.x1 > lineB.x0)) {
      isOverlapped = true;
    }
    if ((lineA.x0 > lineB.x0) && (lineB.x1 > lineA.x0)) {
      isOverlapped = true;
    }
    return { d: d, isOverlapped: isOverlapped };
  }

  // xxxxx

  var Particle = function () {
    this.x = Math.random() * Nature.width;
    this.y = Math.random() * Nature.height;
    this.moveX = this.x;
    this.moveY = this.y;
    this.r = Tool.random(2, 4);
    this.alpha = Tool.random(0.3, 1);
    this.status = false;
    this.velocity = {
      x: Tool.random(-0.35, 0.35),
      y: Tool.random(0.75, 1.5)
    }
    this.chance = 1;
  }

  Particle.prototype.update = function (updater) {
    this.updater = updater;
    this.updater(Nature.camera, this);
  }

  Particle.prototype.render = function (handle) {
    if (typeof handle == 'function') {
      this.handle = handle;
    }
    Nature.time += 0.016;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if ((this.y > Nature.scene.height) || (this.x > Nature.scene.width)) {
      var chance = Math.random();
      if (chance < this.chance) {
        this.x = Math.random() * Nature.scene.width;
        this.y = 0;
      } else {
        this.x = 0;
        this.y = Math.random() * Nature.scene.height;
      }
      this.status = false;
    }
  }

  var handle = function (particle) {
    if (particle.y != 0) {
      return false;
    }
    for (var i = 0; i < Nature.particles.length; i++) {
      if (Nature.particles[i].x == particle.x
        && Nature.particles[i].y == particle.y) {
        continue;
      }
      var lineA = {
        x0: particle.x, x1: particle.moveX,
        y0: particle.y, y1: particle.moveY,
      };
      var lineB = {
        x0: Nature.particles[i].x, x1: Nature.particles[i].moveX,
        y0: Nature.particles[i].y, y1: Nature.particles[i].moveY,
      };
      var result = getTwoLineDistance(lineA, lineB);
      if (result.d > 50) {
        continue;
      }
      if (result.isOverlapped) {
        particle.velocity.x = 0.001;
        particle.velocity.y = 0.001;
        particle.status = 'rainy';
      }
    }
  }

  var snowy = function () {
    Nature.camera.clearRect(0, 0, Nature.scene.width, Nature.scene.height);
    for (var i = 0; i < Nature.particles.length; i++) {
      var particle = Nature.particles[i];
      particle.render();
      particle.update(function (camera) {
        camera.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')';
        camera.beginPath();
        camera.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        camera.closePath();
        camera.fill();
      });
    }
    requestAnimationFrame(snowy);
  }

  var rainy = function () {
    var rainySlope = 1.2;
    Nature.camera.clearRect(0, 0, Nature.scene.width, Nature.scene.height);
    for (var i = 0; i < Nature.particles.length; i++) {
      var particle = Nature.particles[i];
      if (particle.status != 'rainy') {
        particle.chance = 0.7;
        particle.velocity.y = Math.floor(8 + Math.random() * 2);
        particle.velocity.x = particle.velocity.y * rainySlope;
        particle.increment = 30;
        // particle.increment = Math.floor(Math.random() * 2) + 120;
        particle.g = Nature.g;
        particle.alpha = 0.15;
        particle.status = 'rainy';
        // handle(particle);
      }

      particle.render(handle);
      particle.update(function (camera) {
        camera.beginPath();
        camera.moveTo(this.x, this.y);
        this.velocity.y += (1 / 60) * this.g;
        this.velocity.x = this.velocity.y * rainySlope;
        var t = Math.atan(this.velocity.y / this.velocity.x);
        var x = Math.cos(t) * this.increment;
        var y = Math.sin(t) * this.increment;
        camera.lineTo(this.x + x, this.y + y);

        this.moveX = this.x + x;
        this.moveY = this.y + y;

        var rainStyle = camera.createLinearGradient(this.x, this.y, this.x + x, this.y + y);
        // rainStyle.addColorStop(0, '#fff');
        // rainStyle.addColorStop(1, 'rgba(0, 0, 0, ' + this.alpha + ')');
        camera.lineWidth = 2;
        camera.strokeStyle = 'rgba(0, 0, 0, ' + this.alpha + ')';
        camera.stroke();
        camera.closePath();
      });
    }
    requestAnimationFrame(rainy);
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
  rainy();
  // snowy();
})();