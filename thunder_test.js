;(function() {
  var BiTree = (function() {
    function t(t) {
      ;(this.rightChild = null), (this.leftChild = null), (this.parent = null), (this.context = null), (this.context = t)
    }
    var i = t.prototype
    return (
      (i._push = function(i) {
        var h = new t(i)
        return (h.parent = this), h
      }),
      (i.rightPush = function(t) {
        this.rightChild = this._push(t)
      }),
      (i.leftPush = function(t) {
        this.leftChild = this._push(t)
      }),
      t
    )
  })()

  var rand = function(min, max) {
    return Math.random() * (max - min) + min
  }
  var polar = function(degree, length) {
    var x = length * Math.cos(degree)
    var y = length * Math.sin(degree)
    return { x: Math.ceil(x), y: Math.ceil(y) }
  }
  var gen = function(width, number) {
    var divid = width / number
    var res = []
    for (var i = 0; i < width; i += divid) {
      res.push(Math.ceil(rand(i, i + divid)))
    }
    return res
  }

  // Lies weather <thunder>
  var ThunderID = 0
  var queue = []
  var trees = []
  var path = function(adjust) {
    return Math.ceil(rand(0, 20)) / 10 + 0.5 + (adjust || 0)
  }
  var create = function(thunder) {
    var context = thunder.context
    var p = polar(context.degree, context.length)
    var x = p.x + context.x
    var y = p.y + context.y
    var width = context.width
    var degree = path(context.adjust || 0)
    var length = rand(10, 14)
    return {
      startX: context.x,
      startY: context.y,
      max: context.max,
      id: context.id,
      adjust: context.adjust || 0,
      count: context.count || context.count === 0 ? context.count + 1 : 0,
      width: context.width,
      x: x,
      y: y,
      degree: degree,
      width: width,
      length: length
    }
  }
  var counter = 0
  var number = gen(30, 3)
  var child = gen(20, 2)
  var growth = function(thunder) {
    if (thunder.context.count < thunder.context.max) {
      var newThunderContext = create(thunder)
      thunder.leftPush(newThunderContext)
      queue.push(thunder.leftChild)
    }
    if (thunder.context.id == 0 && number.indexOf(thunder.context.count) !== -1) {
      const shape = shaper(thunder, 1)
      branch(shape)
    }
    if (thunder.context.id == 1 && child.indexOf(thunder.context.count) !== -1) {
      const shape = shaper(thunder, 0.5)
      branch(shape)
    }
  }
  var shaper = function(thunder, pos) {
    let adjust
    if (rand(0, 1) > 0.5) {
      adjust = thunder.context.adjust + pos
    } else {
      adjust = thunder.context.adjust - pos
    }
    return { adjust: adjust, thunder: thunder, max: (1 * thunder.context.max) / 2 }
  }
  var branch = function(shape) {
    const thunder = shape.thunder
    const adjust = shape.adjust
    const max = shape.max
    var newThunderContext = create(thunder)
    ThunderID++
    newThunderContext.adjust = adjust
    newThunderContext.degree = path(adjust)
    newThunderContext.width = 2
    newThunderContext.count = 0
    newThunderContext.max = max
    newThunderContext.id = ThunderID
    thunder.rightPush(newThunderContext)
    trees.push(thunder.rightChild)
    queue.push(thunder.rightChild)
  }

  var thunder = new BiTree({
    startX: 400,
    startY: 0,
    x: 400,
    y: 0,
    width: 2,
    max: 80,
    degree: Math.PI / 2,
    length: rand(10, 14),
    count: 0,
    id: 0
  })

  trees.push(thunder)

  var canv = document.getElementById('canv')
  canv.width = window.innerWidth
  canv.height = window.innerHeight
  var ctx = canv.getContext('2d')
  var rafId

  var read = function(thunder) {
    console.log(thunder.context.id)
    if (thunder.leftChild) {
      read(thunder.leftChild)
    }
  }
  var render = function(thunder) {
    var previous = thunder.context
    ctx.beginPath()
    ctx.moveTo(previous.startX, previous.startY)
    ctx.lineTo(previous.x, previous.y)
    ctx.lineWidth = previous.width
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.stroke()
  }

  queue.push(thunder)
  var raf = function() {
    var thunder = queue.shift()
    render(thunder)
    if (counter > 300) {
      cancelAnimationFrame(rafId)
    } else {
      counter++
      growth(thunder)
      rafId = requestAnimationFrame(raf)
    }
  }
  rafId = requestAnimationFrame(raf)
})()
