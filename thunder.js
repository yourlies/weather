var rand = function (min, max) {
  return ~~((Math.random() * (max - min + 1)) + min);
}

var Thunder = function (options) {
  this.ctx = options.ctx;
  this.width = options.width;
  this.height = options.height;
  this.lights = [];
  this.lightTimeCurrent = 0;
  this.lightTimeTotal = 400;
}
Thunder.prototype.create= function (x, y, canSpawn) {
  this.lights.push({
    x: x, y: y,
    xRange: rand(5, 30), yRange: rand(5, 25),
    path: [{ x: x, y: y }],
    pathLimit: rand(35, 45),
    canSpawn: canSpawn,
    hasFired: false
  });
}
Thunder.prototype.update = function () {
  var i = this.lights.length;
  while (i--) {
    var light = this.lights[i];            
    light.path.push({
      x: light.path[light.path.length - 1].x + (rand(0, light.xRange) - (light.xRange / 2)),
      y: light.path[light.path.length - 1].y + (rand(0, light.yRange))
    });
    if (light.path.length > light.pathLimit) {
      this.lights.splice(i, 1);
    }
    light.hasFired = true;
  }
}
Thunder.prototype.render = function () {
  var i = this.lights.length;
  while (i--) {
    var light = this.lights[i];
    this.ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    this.ctx.lineWidth = 2;
    if (rand(0, 30) == 0) {
      this.ctx.lineWidth = 2 + 2;
    }
    if (rand(0, 60) == 0) {
      this.ctx.lineWidth = 3 + 2;
    }
    if (rand(0, 90) == 0) {
      this.ctx.lineWidth = 4 + 2;
    }
    if (rand(0, 120) == 0) {
      this.ctx.lineWidth = 5 + 2;
    }
    if (rand(0, 150) == 0) {
      this.ctx.lineWidth = 6 + 2;
    } 
    this.ctx.beginPath();
    var pathCount = light.path.length;
    this.ctx.moveTo(light.x, light.y);
    for (var pc = 0; pc < pathCount; pc++){  
      this.ctx.lineTo(light.path[pc].x, light.path[pc].y);
      if(light.canSpawn){
        if(rand(0, 100) == 0){
          light.canSpawn = false;
          this.create(light.path[pc].x, light.path[pc].y, false);
        } 
      }
    }
    if (!light.hasFired) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, '+ rand(4, 12)/100+')';
      this.ctx.fillRect(0, 0, this.width, this.height);  
    }
    if (rand(0, 30) == 0) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, '+ rand(1, 3) / 100 + ')';
      this.ctx.fillRect(0, 0, this.width, this.height);  
    } 
    this.ctx.stroke();
  };
}
Thunder.prototype.lightTimer = function () {
  this.lightTimeCurrent++;
  if (this.lightTimeCurrent >= this.lightTimeTotal) {
    var newX = rand(100, this.width / 2);
    var newY = rand(0, this.height / 10); 
    var createCount = 1;
    while (createCount--) {
      this.create(newX, newY, true);
    }
    this.lightTimeCurrent = 0;
    this.lightTimeTotal = rand(300, 400);
  }
}
Thunder.prototype.updater = function () {
  this.update();
  this.lightTimer();
  this.render();
}
$process.Thunder = Thunder;