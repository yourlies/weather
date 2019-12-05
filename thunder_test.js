(function () {
  var rand = function (min, max) {
    return ~~((Math.random() * (max - min + 1)) + min);
  }
  var growth = function (thunder) {
    var previous = thunder[thunder.length - 1];
    var x, y, next;
    x = previous.next + previous.x;
    y = rand(6, 10) + previous.y;
    if (x > previous.x) {
      next = rand(-3, 8);
    } else {
      next = rand(-8, 3);
    }

    thunder.push({ x: x, y: y, next: next, width: 1 });
  }

  var thunder = [{ x: 300, y: 0, width: 4, next: rand(-8, 8) }];
  var canv = document.getElementById('canv');
  var ctx = canv.getContext('2d');
  var rafId;
  var raf = function () {
    var previous = thunder[thunder.length - 1];
    ctx.lineTo(previous.x, previous.y);
    ctx.lineWidth = previous.width;
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.stroke();
    if (thunder.length > 80) {
      cancelAnimationFrame(rafId);
    } else {
      growth(thunder);
      rafId = requestAnimationFrame(raf);
    }
  };
  rafId = requestAnimationFrame(raf);
})();