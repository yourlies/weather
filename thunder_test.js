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
      length: length,
      opacity: 1
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
      const shape = shaper(thunder, 0.7)
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
    opacity: 1,
    id: 0
  })

  trees.push(thunder)

  var canv = document.getElementById('canv')
  canv.width = window.innerWidth
  canv.height = window.innerHeight
  var ctx = canv.getContext('2d')
  var rafId

  var render = function(thunder) {
    var previous = thunder.context
    ctx.beginPath()
    ctx.moveTo(previous.startX, previous.startY)
    ctx.lineTo(previous.x, previous.y)
    ctx.lineWidth = previous.width
    ctx.strokeStyle = `rgba(0, 0, 0, ${previous.opacity})`
    ctx.stroke()
  }

  queue.push(thunder)
  var num = 0
  for (var i = 0; i < 240; i++) {
    growth(queue[num])
    num++
  }
  var read = function(thunder, index) {
    if (index > counter) {
      return false
    }
    if (thunder.leftChild) {
      render(thunder)
      read(thunder.leftChild, index + 1)
    }
  }
  var historyQueue = []
  var thunderQueue = []
  thunderQueue.push(queue[0])
  var raf = function() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    var length = thunderQueue.length
    // for (var i = 0; i < historyQueue.length; i++) {
    //   if (historyQueue[i]) {
    //     historyQueue[i].context.opacity -= 0.1
    //     if (historyQueue[i].context.opacity < 0.05) {
    //       historyQueue[i].context.opacity = 0.05
    //     }
    //     render(historyQueue[i])
    //   }
    // }
    read(queue[0], 0)
    for (var i = 0; i < length; i++) {
      var thunderCurrent = thunderQueue.shift()
      historyQueue.push(thunderCurrent)
      if (!thunderCurrent) {
        break
      }
      render(thunderCurrent)
      thunderCurrent = thunderCurrent.leftChild
      thunderQueue.push(thunderCurrent)
      if (!thunderCurrent) {
        break
      }
      while (thunderCurrent.rightChild) {
        thunderCurrent = thunderCurrent.rightChild
        thunderQueue.push(thunderCurrent)
      }
    }
    if (counter > 300) {
      cancelAnimationFrame(rafId)
    } else {
      counter++
      rafId = requestAnimationFrame(raf)
    }
  }
  rafId = requestAnimationFrame(raf)
})()
