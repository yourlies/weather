(function () {
  var BiTree=function(){function t(t){this.rightChild=null,this.leftChild=null,this.parent=null,this.context=null,this.context=t}var i=t.prototype;return i._context=function(t){this.context=t},i._push=function(i){var n=new t(i);return n.parent=this,this._context(i),n},i.rightPush=function(t){this.rightChild=this._push(t)},i.leftPush=function(t){this.leftChild=this._push(t)},t}();
  var rand = function (min, max) {
    return (Math.random() * (max - min) + min);
  }
  var polar = function (degree, length) {
    var x = length * Math.cos(degree);
    var y = length * Math.sin(degree);
    return { x: Math.ceil(x), y: Math.ceil(y) }
  }

  // Lies weather <thunder>
  var queue = [];
  var path = function (adjust) {
    return Math.ceil(rand(0, 20)) / 10 + 0.5 + (adjust || 0);
  }
  var create = function (thunder) {
    var context = thunder.context;
    var p = polar(context.degree, context.length);
    var x = p.x + context.x;
    var y = p.y + context.y;
    var width = context.width;
    var degree = path(context.adjust || 0);
    var length = rand(10, 14);
    return {
      startX: context.x, startY: context.y,
      adjust: context.adjust || 0,
      width: context.width,
      x: x, y: y, degree: degree, width: width, length : length
    }
  }
  var counter = 0;
  var growth = function (thunder) {
    var newThunderPath = create(thunder);
    thunder.leftPush(newThunderPath);
    queue.push(thunder.leftChild);
    if (counter == 5 || counter == 20 || counter == 61) {
      var newThunderPath = create(thunder);
      newThunderPath.adjust = counter == 20 ? -1 : 1;
      newThunderPath.degree = path(counter == 20 ? -1 : 1);
      newThunderPath.width = 2;
      thunder.rightPush(newThunderPath);
      queue.push(thunder.rightChild);
    }
  }

  var thunder = new BiTree({
    startX: 300, startY: 0,
    x: 300, y: 0, width: 2,
    degree: Math.PI / 2,
    length: rand(10, 14),
  });

  var canv = document.getElementById('canv');
  var ctx = canv.getContext('2d');
  var rafId;

  queue.push(thunder);
  var raf = function () {
    var thunder = queue.shift();
    var previous = thunder.context;
    ctx.beginPath();
    ctx.moveTo(previous.startX, previous.startY);
    ctx.lineTo(previous.x, previous.y);
    ctx.lineWidth = previous.width;
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.stroke();
    if (counter > 200) {
      cancelAnimationFrame(rafId);
    } else {
      counter++;
      growth(thunder);
      rafId = requestAnimationFrame(raf);
    }
  };
  rafId = requestAnimationFrame(raf);
})();