; (function () {
  var snowy = function () {
    Nature.camera.clearRect(0, 0, Nature.scene.width, Nature.scene.height)
    for (var i = 0; i < Nature.particles.length; i++) {
      var particle = Nature.particles[i]
      particle.render()
      particle.update(function (camera) {
        camera.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')'
        camera.beginPath()
        camera.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
        camera.closePath()
        camera.fill()
      })
    }
    requestAnimationFrame(snowy)
  }
});
; (function () {
  var Nature = {}
  Nature.FPS = 60
  Nature.g = 6
  Nature.leans = 0.5

  var Tool = {}
  Tool.random = function (min, max) {
    return Math.random() * (max - min) + min
  }

  window.requestAnimationFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callBack) {
        window.setTimeout(callBack, 1000 / Nature.FPS)
      }
    )
  })()

  window.cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame || window.clearTimeout
  })()

  var Particle = function (context) {
    this.width = context.width
    this.height = context.height
    this.x = Math.random() * context.width
    this.y = Math.random() * context.height
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
  Particle.prototype.update = function (updater) {
    this.updater = updater
    this.updater()
  }
  Particle.prototype.render = function (recycle) {
    this.x += this.velocity.x
    this.y += this.velocity.y
    if (this.moveY > this.height) {
      if (typeof recycle == 'function') {
        this.recycle = recycle
        this.recycle(this)
      }
    }
    if (this.moveY > this.height || this.x > this.width) {
      var chance = Math.random()
      if (chance > this.chance) {
        this.x = Math.random() * this.width
        this.y = 0
      } else {
        this.x = 0
        this.y = Math.random() * this.height
      }
      this.status = false
    }
  }

  var RainyAdapt = function (particle) {
    if (particle.height * Nature.leans > particle.height) {
      particle.chance = (particle.width / Nature.leans / particle.height) * 0.5
    } else {
      particle.chance = ((particle.height * Nature.leans) / particle.width) * 0.5
    }
    particle.velocity.y = Math.floor(20 + Math.random() * 5)
    particle.g = Nature.g
    particle.velocity.x = particle.velocity.y * Nature.leans
    particle.alpha = 0.1
    particle.status = 'rainy'
    particle.back = false
  }
  var RainyLayer = function (particle) {
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
  var RainyUpdater = function (ctx) {
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

  var Rainy = function (options) {
    this.canv = options.canv
    this.ctx = options.ctx
    this.recycle = options.recycle
    this.particles = options.particles
    this.weather = options
  }
  Rainy.prototype.updater = function () {
    if (this.particles.length <= 0) {
      this.weather.updater()
    }
    var _this = this
    for (var i = 0; i < this.particles.length; i++) {
      var particle = this.particles[i]
      if (particle.status != 'rainy') {
        RainyAdapt(particle)
        RainyLayer(particle)
      }
      particle.render(this.recycle)
      particle.update(function () {
        this.RainyUpdater = RainyUpdater
        this.RainyUpdater(_this.ctx)
      })
    }
  }

  var Weather = function (canv, recycle) {
    this.canv = canv
    this.ctx = this.canv.getContext('2d')
    this.width = this.canv.width
    this.height = this.canv.height
    this.recycle = recycle
    this.particles = []
    this.frame = 0
  }
  Weather.prototype.updater = function () {
    this.frame++
    if (this.frame >= 60) {
      this.frame = 0
      var particle = new Particle(this.canv)
      this.particles.push(particle)
    }
  }

  window.$process = window.$process || {}
  $process.Rainy = Rainy
  $process.Weather = Weather
})()
