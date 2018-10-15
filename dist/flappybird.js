(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.FlappyBird = factory());
}(this, (function () { 'use strict';

  function isPC() { 
    var userAgentInfo = navigator.userAgent; 
    var Agents = ['Android', 'iPhone', 'iPad', 'Mobile']; 
    var flag = true; 
    for (var v = 0; v < Agents.length; v++) { 
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false;
        break;
      } 
    } 
    return flag; 
  }

  var images = {
  	bg_day: {x:0,y:748,w:288,h:512},
  	bg_night: {x:104,y:236,w:288,h:512},
  	bird: {x:0,y:0,w:34,h:24},
  	bird1_0: {x:0,y:48,w:48,h:48},
  	button_pause: {x:34,y:0,w:26,h:28},
  	button_play: {x:0,y:110,w:116,h:70},
  	button_resume: {x:60,y:0,w:26,h:28},
  	medals_0: {x:174,y:0,w:44,h:44},
  	medals_1: {x:86,y:0,w:44,h:44},
  	medals_2: {x:218,y:0,w:44,h:44},
  	medals_3: {x:130,y:0,w:44,h:44},
  	pipe_down: {x:52,y:236,w:52,h:320},
  	pipe_up: {x:0,y:236,w:52,h:320},
  	score_panel: {x:230,y:110,w:238,h:126},
  	text_game_over: {x:48,y:48,w:204,h:54},
  	text_ready: {x:252,y:48,w:196,h:62},
  	title: {x:262,y:0,w:178,h:48},
  	tutorial: {x:116,y:110,w:114,h:98}
  };

  var Shape = function Shape(ctx, img) {
    this.ctx = ctx;
    this.img = img;
  };

  Shape.prototype.draw = function draw (name, x, y, width, height) {
    var pos = images[name];
    var sx = pos.x;
    var sy = pos.y;
    var sWidth = pos.w;
    var sHeight = pos.h;
    this.ctx.drawImage(
      this.img,
      sx,
      sy,
      sWidth,
      sHeight,
      x,
      y,
      width,
      height
    );
  };

  var Game = function Game(ctx) {
    this.ctx = ctx;
    this.bgWidth = 320;
    this.bgHeight = 480,
    this.gapHeight = 100; //上下管道之间的距离
    this.gapPipe = 2500; //管道循环生成间隔 ms
    this.SpeedX = 1.5; //管道左移速度
    this.intval = 1000/60; //重绘速度ms
    this.score = 0; //得分
    this.bestScore = 0;
    this.lastScore = 0;
    this.id = 0; //一组管道的唯一标示
    this.pipeList = []; //管道对象的数组
    this.isCover = true;
    this.isReady = false;
    this.isControl = true;//是否可以点击暂停或运行
    this.isPause = false; //是否是暂停状态
    this.timer = null; //整体run的定时器
    this.pipe_timer = null; //管道循环生成的定时器
    this.bird = null;
    this.handler1 = null;
    this.handler2 = null;
    this.s_die = null; //死亡音效对象
    this.s_wing = null; //飞翔音效对象
    this.s_point = null; //得分音效对象
    this.s_hit = null; //碰撞音效对象
    this.eventType = {
      start : isPC() ? 'mousedown' : 'touchstart'
    };
  };

  Game.prototype.init = function init () {
  		var this$1 = this;

  		this.img = new Image();
    this.img.src = 'source/flappybird.png';
  		this.img.onload = function () {
      this$1.shape = new Shape(this$1.ctx, this$1.img);
      this$1.shape.draw('bg_night', 0, 0, this$1.bgWidth, this$1.bgHeight);
  		};
  		// if(this.getTime() < 19 && this.getTime() > 6) {
  		// 	bg.src = 'images/bg_day.png';
  		// } else {
  		// 	bg.src = 'images/bg_night.png';
  		// }
  		// setTimeout(() => {
  		// 	this.drawCover();
  		// }, 200);

    //初始化音效
  		// this.initSound();

  		//开始游戏按钮监听
  		// this.coverListener();
  };

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var game = new Game(ctx);

  function index () {
    console.log(game);
    game.init();
  }

  return index;

})));
