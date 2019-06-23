(function () {
  // 
  var Nature = {};
  Nature.scene = document.getElementById('canv');
  Nature.camera = Nature.scene.getContext('2d');
  Nature.entity = 20;
  Nature.particles = [];
  Nature.time = 0;
  Nature.width = window.innerWidth;
  Nature.height = window.innerHeight;
  Nature.entity = Math.floor((Nature.width * Nature.height) / 40000);
  Nature.FPS = 60;
  Nature.g = 10;
  Nature.leans = 0.5;

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
  // 

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
      if (chance > this.chance) {
        this.x = Math.random() * Nature.scene.width;
        this.y = 0;
      } else {
        this.x = 0;
        this.y = Math.random() * Nature.scene.height;
      }
      this.status = false;
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
    if (window.istop) {
      requestAnimationFrame(rainy);
      return false;
    }
    Nature.camera.clearRect(0, 0, Nature.scene.width, Nature.scene.height);
    for (var i = 0; i < Nature.particles.length; i++) {
      var particle = Nature.particles[i];
      if (particle.status != 'rainy') {
        if (Nature.height * Nature.leans > Nature.height) {
          particle.chance = ((Nature.width / Nature.leans) / Nature.height) * 0.5;
        } else {
          particle.chance = ((Nature.height * Nature.leans) / Nature.width) * 0.5;
        }
        particle.velocity.y = Math.floor(13 + Math.random() * 2);
        particle.g = Nature.g;
        var luckyNumber = Math.random();
        switch (true) {
          case luckyNumber > 0.66:
            particle.increment = 40;
            break;
          case luckyNumber > 0.33:
            particle.increment = 35;
            particle.velocity.y = particle.velocity.y * 0.8;
            particle.g = Nature.g * 0.8;
            break;
          default:
            particle.increment = 30;
            particle.velocity.y = particle.velocity.y * 0.6;
            particle.g = Nature.g * 0.6;
            break;
        }
        particle.velocity.x = particle.velocity.y * Nature.leans;
        particle.alpha = 0.1;
        particle.status = 'rainy';
        particle.back = false;

        if (Math.random() > 0.7) {
          particle.velocity.y = particle.velocity.y * 0.5;
          particle.g = Nature.g * 0.5;
          particle.back = true;
        }
      }

      particle.render();
      particle.update(function (camera) {
        camera.beginPath();
        camera.moveTo(this.x, this.y);
        this.velocity.y += (1 / 60) * this.g;
        this.velocity.x = this.velocity.y * Nature.leans;
        var t = Math.atan(this.velocity.y / this.velocity.x);
        var x = Math.cos(t) * this.increment;
        var y = Math.sin(t) * this.increment;
        camera.lineTo(this.x + x, this.y + y);

        this.moveX = this.x + x;
        this.moveY = this.y + y;
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

  window.stop = function () {
    window.istop = true;
  }
  window.begin = function () {
    window.istop = false;
  }

  // snowy();
})();