;(function() {
  var snowy = function() {
    Nature.camera.clearRect(0, 0, Nature.scene.width, Nature.scene.height)
    for (var i = 0; i < Nature.particles.length; i++) {
      var particle = Nature.particles[i]
      particle.render()
      particle.update(function(camera) {
        camera.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')'
        camera.beginPath()
        camera.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        camera.closePath()
        camera.fill()
      })
    }
    requestAnimationFrame(snowy)
  }
})

;(function() {
  var Nature = {}
  Nature.scene = document.getElementById('canv')
  Nature.camera = Nature.scene.getContext('2d')
  Nature.particles = []
  Nature.width = window.innerWidth
  Nature.height = window.innerHeight
  Nature.entity = Math.floor((Nature.width * Nature.height) / 60000)
  // Nature.entity = 2;
  Nature.FPS = 60
  Nature.g = 5
  Nature.leans = 0.5

  var Tool = {}
  Tool.random = function(min, max) {
    return Math.random() * (max - min) + min
  }

  window.requestAnimationFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callBack) {
        window.setTimeout(callBack, 1000 / Nature.FPS)
      }
    )
  })()

  window.cancelAnimationFrame = (function() {
    return window.cancelAnimationFrame || window.clearTimeout
  })()

  var getTwoLineDistance = function(lineA, lineB) {
    var k = (lineA.y0 - lineA.y1) / (lineA.x0 - lineA.x1)
    var b = lineA.y0 - k * lineA.x0
    var d = Math.abs(k * lineB.x0 + -1 * lineB.y0 + b) / Math.sqrt(k * k + 1)
    var isOverlapped = false
    if (lineA.x0 < lineB.x0 && lineA.x1 > lineB.x0) {
      isOverlapped = true
    }
    if (lineA.x0 > lineB.x0 && lineB.x1 > lineA.x0) {
      isOverlapped = true
    }
    return { d: d, isOverlapped: isOverlapped }
  }

  var Particle = function() {
    this.x = Math.random() * Nature.width
    this.y = Math.random() * Nature.height
    this.moveX = this.x
    this.moveY = this.y
    this.r = Tool.random(2, 4)
    this.alpha = Tool.random(0.3, 1)
    this.status = false
    this.velocity = {
      x: Tool.random(-0.35, 0.35),
      y: Tool.random(0.75, 1.5)
    }
    this.chance = 1
  }
  Particle.prototype.update = function(updater) {
    this.updater = updater
    this.updater()
  }
  Particle.prototype.render = function(recycle) {
    this.x += this.velocity.x
    this.y += this.velocity.y
    if (this.moveY > Nature.scene.height) {
      if (typeof recycle == 'function') {
        this.recycle = recycle
        this.recycle(this)
      }
    }
    if (this.moveY > Nature.scene.height || this.x > Nature.scene.width) {
      var chance = Math.random()
      if (chance > this.chance) {
        this.x = Math.random() * Nature.scene.width
        this.y = 0
      } else {
        this.x = 0
        this.y = Math.random() * Nature.scene.height
      }
      this.status = false
    }
  }

  var RainyAdapt = function(particle) {
    if (Nature.height * Nature.leans > Nature.height) {
      particle.chance = (Nature.width / Nature.leans / Nature.height) * 0.5
    } else {
      particle.chance = ((Nature.height * Nature.leans) / Nature.width) * 0.5
    }
    particle.velocity.y = Math.floor(20 + Math.random() * 5)
    particle.g = Nature.g
    particle.velocity.x = particle.velocity.y * Nature.leans
    particle.alpha = 0.1
    particle.status = 'rainy'
    particle.back = false
  }
  var RainyLayer = function(particle) {
    var rate = Math.random()
    switch (true) {
      case rate > 0.66:
        particle.increment = 55
        break
      case rate > 0.33:
        particle.increment = 50
        particle.velocity.y = particle.velocity.y * 0.8
        particle.g = Nature.g * 0.8
        break
      default:
        particle.increment = 40
        particle.velocity.y = particle.velocity.y * 0.6
        particle.g = Nature.g * 0.6
        particle.alpha = particle.alpha * 0.6
        break
    }
  }

  var RainyUpdater = function(ctx) {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    this.velocity.y += (1 / 60) * this.g
    this.velocity.x = this.velocity.y * Nature.leans
    var t = Math.atan(this.velocity.y / this.velocity.x)
    var x = Math.cos(t) * this.increment
    var y = Math.sin(t) * this.increment
    ctx.lineTo(this.x + x, this.y + y)

    this.moveX = this.x + x
    this.moveY = this.y + y
    ctx.lineWidth = 4
    ctx.strokeStyle = 'rgba(0, 0, 0, ' + this.alpha + ')'
    ctx.stroke()
    ctx.closePath()
  }

  var Rainy = function(options) {
    this.ctx = options.ctx
    this.recycle = options.recycle
  }
  Rainy.prototype.updater = function() {
    var _this = this
    for (var i = 0; i < Nature.particles.length; i++) {
      var particle = Nature.particles[i]
      if (particle.status != 'rainy') {
        RainyAdapt(particle)
        RainyLayer(particle)
      }
      particle.render(this.recycle)
      particle.update(function() {
        this.RainyUpdater = RainyUpdater
        this.RainyUpdater(_this.ctx)
      })
    }
  }

  var Thunder = function(options) {
    this.ctx = options.ctx
  }
  Thunder.prototype.updater = function() {}

  var weatherId
  var frame = 0
  var weather = function() {
    frame++
    if (frame >= 60) {
      frame = 0
      var particle = new Particle()
      Nature.particles.push(particle)
    }
    if (Nature.particles.length >= Nature.entity) {
      cancelAnimationFrame(weatherId)
    } else {
      weatherId = requestAnimationFrame(weather)
    }
  }
  weather()

  Nature.scene.width = Nature.width
  Nature.scene.height = Nature.height

  window.$process = window.$process || {}
  $process.Rainy = Rainy
  $process.Thunder = Thunder
  // var rainy = new Rainy();
  // var watcher = function () {
  //   rainy.watcher();
  //   requestAnimationFrame(watcher);
  // };
  // requestAnimationFrame(watcher);
})()
