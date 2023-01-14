(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/// <reference path="../interface.d.ts" />
var random_1 = __importDefault(require("../lib/random"));
var Particle = /** @class */ (function () {
    function Particle(context) {
        this.width = context.width;
        this.height = context.height;
        this.leans = context.leans;
        this.gravity = context.gravity;
        this.g = context.gravity;
        this.velocity = { x: 0, y: 0 };
        this.increment = 0;
        this.back = false;
        this.x = Math.random() * context.width;
        this.y = Math.random() * context.height;
        this.moveX = this.x;
        this.moveY = this.y;
        this.r = (0, random_1["default"])(2, 4);
        this.alpha = (0, random_1["default"])(0.3, 1);
        this.status = '';
        this.velocity = {
            x: (0, random_1["default"])(-0.35, 0.35),
            y: (0, random_1["default"])(0.75, 1.5)
        };
        this.chance = 1;
        this.recycle = context.recycle || function () { };
    }
    Particle.prototype.render = function () {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.moveY > this.height) {
            this.recycle(this);
        }
        if (this.moveY > this.height || this.x > this.width) {
            var chance = Math.random();
            if (chance > this.chance) {
                this.x = Math.random() * this.width;
                this.y = 0;
            }
            else {
                this.x = 0;
                this.y = Math.random() * this.height;
            }
            this.status = '';
        }
    };
    return Particle;
}());
exports["default"] = Particle;

},{"../lib/random":5}],2:[function(require,module,exports){
"use strict";
/// <reference path="../interface.d.ts" />
exports.__esModule = true;
var Rainy = /** @class */ (function () {
    function Rainy(weather) {
        this.canv = weather.canv;
        this.ctx = weather.ctx;
        this.recycle = weather.recycle;
        this.particles = weather.particles;
        this.weather = weather;
    }
    Rainy.prototype.updater = function () {
        if (this.particles.length <= 0) {
            this.weather.updater();
        }
        for (var i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i];
            if (particle.status != 'rainy') {
                this.RainyAdapt(particle);
                this.RainyLayer(particle);
            }
            particle.render(this.recycle);
            this.RainyUpdater(particle);
        }
    };
    Rainy.prototype.RainyAdapt = function (particle) {
        if (particle.height * particle.leans > particle.height) {
            particle.chance = (particle.width / particle.leans / particle.height) * 0.5;
        }
        else {
            particle.chance = ((particle.height * particle.leans) / particle.width) * 0.5;
        }
        var vy = 12 + Math.random() * 5;
        particle.velocity.y = Math.floor(vy * 60 / this.weather.sysFrame);
        particle.velocity.x = particle.velocity.y * particle.leans;
        particle.alpha = 0.1;
        particle.status = 'rainy';
        particle.back = false;
    };
    Rainy.prototype.RainyLayer = function (particle) {
        var rate = Math.random();
        switch (true) {
            case rate > 0.66:
                particle.increment = 55;
                break;
            case rate > 0.33:
                particle.increment = 50;
                particle.velocity.y = particle.velocity.y * 0.8;
                particle.g = particle.gravity * 0.8;
                break;
            default:
                particle.increment = 40;
                particle.velocity.y = particle.velocity.y * 0.6;
                particle.g = particle.gravity * 0.6;
                particle.alpha = particle.alpha * 0.6;
                break;
        }
    };
    Rainy.prototype.RainyUpdater = function (particle) {
        this.ctx.beginPath();
        this.ctx.moveTo(particle.x, particle.y);
        var frame = this.weather.sysFrame || 60;
        particle.velocity.y += (1 / frame) * particle.g;
        particle.velocity.x = particle.velocity.y * particle.leans;
        var t = Math.atan(particle.velocity.y / particle.velocity.x);
        var x = Math.cos(t) * particle.increment;
        var y = Math.sin(t) * particle.increment;
        this.ctx.lineTo(particle.x + x, particle.y + y);
        particle.moveX = particle.x + x;
        particle.moveY = particle.y + y;
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeStyle = 'rgba(0, 0, 0, ' + particle.alpha + ')';
        this.ctx.stroke();
        this.ctx.closePath();
    };
    return Rainy;
}());
exports["default"] = Rainy;

},{}],3:[function(require,module,exports){
"use strict";
/// <reference path="../interface.d.ts" />
exports.__esModule = true;
var Weather = /** @class */ (function () {
    function Weather(context) {
        this.lastTimestamp = 0;
        this.sysFrame = 0;
        this.canv = context.canv;
        this.ctx = context.ctx;
        this.particles = [];
        this.update = context.update;
        this.particleContext = context.particleContext;
        this.frame = 0;
    }
    Weather.prototype.updater = function () {
        if (this.frame >= 60 && this.sysFrame == 0) {
            this.sysFrame = Math.floor(1000 * 30 / (new Date().getTime() - this.lastTimestamp));
        }
        if (this.sysFrame > 0 && this.frame >= Math.floor(this.sysFrame) / 2) {
            this.update();
            this.frame = 0;
        }
        if (this.frame == 0) {
            this.lastTimestamp = new Date().getTime();
        }
        this.frame++;
    };
    return Weather;
}());
exports["default"] = Weather;

},{}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Weather_1 = __importDefault(require("./core/Weather"));
var Rainy_1 = __importDefault(require("./core/Rainy"));
var Particle_1 = __importDefault(require("./core/Particle"));
window.$process = window.$process || {};
window.$process.Weather = Weather_1["default"];
window.$process.Rainy = Rainy_1["default"];
window.$process.Particle = Particle_1["default"];

},{"./core/Particle":1,"./core/Rainy":2,"./core/Weather":3}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function default_1(min, max) {
    return Math.random() * (max - min) + min;
}
exports["default"] = default_1;

},{}]},{},[4]);
