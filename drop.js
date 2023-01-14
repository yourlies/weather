(function () {
  var getRgb = function (r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
  };
  var Drop = function (options) {
    this.options = options || {};
    this.gravity = this.options.gravity || 0.5;
    this.canv = this.options.canv;
    this.ctx = this.options.ctx;
    this.drops = [];
  };
  Drop.prototype.update = function (adapt) {
    var _this = this;
    if (this.drops.length > 0) {
      this.drops.forEach(function (drop) {
        drop.posx = drop.posx + drop.vx * adapt;
        drop.vy = drop.vy + _this.gravity;
        drop.posy = drop.posy + drop.vy * adapt;
        drop.color = drop.color + 6;
        if (drop.posy > _this.canv.clientHeight) {
          drop.die = true;
        }
      });
    }
    for (var i = this.drops.length - 1; i >= 0; i--) {
      if (this.drops[i].die) {
        this.drops.splice(i, 1);
      }
    }
  };
  Drop.prototype.render = function () {
    var _this = this;
    this.ctx.lineWidth = 2;
    this.drops.forEach(function (e) {
      _this.ctx.strokeStyle = getRgb(e.color, e.color, e.color);
      _this.ctx.beginPath();
      _this.ctx.arc(e.posx, e.posy, e.radius, 0.2 * Math.PI, 2 * Math.PI);
      _this.ctx.stroke();
    });
  };
  Drop.prototype.create = function (e) {
    var entries = Math.floor(Math.random() * 2 + 4);
    for (var i = 0; i < entries; i++) {
      var drop = {
        die: false,
        posx: e.x,
        posy: e.y,
        vx: e.vx || (Math.random() - 0.5) * 8,
        vy: e.vy || Math.random() * -6 - 3,
        radius: e.radius || Math.random() * 1 + 0.5,
        color: e.color || 0,
      };
      if (e.forward == 1) {
        drop.vx = e.vyx || Math.random() * 8;
      }
      this.drops.push(drop);
    }
  };

  Drop.prototype.watcher = function (e) {
    this.create(e);
  };
  Drop.prototype.updater = function (sysFrame) {
    this.update(50 / sysFrame);
    this.render();
  };

  window.$process = window.$process || {};
  $process.Drop = Drop;
})();
