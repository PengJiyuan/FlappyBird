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

  function addEvent(element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + type, handler);
    } else {
      element['on' + type] = handler;
    }
  }

  function removeEvent(element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent('on' + type, handler);
    } else {
      element['on' + type] = null;
    }
  }

  function getEventPosition(ev) {
    var x, y;
    if (ev.touches) {
  	  x = ev.touches[0].pageX;
      y = ev.touches[0].pageY;
    } else if (ev.layerX || ev.layerX === 0) {
      x = ev.layerX;
      y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX === 0) {
      x = ev.offsetX;
      y = ev.offsetY;
    }
    return { x: x, y: y };
  }

  //获得start到end的随机数
  function getRandom(start, end) {
  	return Math.round(Math.random() * (end - start) + start);
  }

  // 画雪碧图

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
  	score_panel: {x:231,y:110,w:238,h:126},
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

  var Bird = function Bird(gameIns) {
    this.gameIns = gameIns;
    this.shape = gameIns.shape;
    this.width = 34;
    this.height = 24;
    this.left = (gameIns.width - this.width) / 2;
    this.top = (gameIns.height - this.height) / 2 - 100;
    this.g = 1; // 重力
    this.rotate = 0;
    this.timer = null;
    this.timer2 = null;
  };

  Bird.prototype.draw = function draw () {
    this.gameIns.ctx.save();
    this.gameIns.ctx.translate(this.left + this.width / 2, this.top + this.height / 2);
    this.gameIns.ctx.rotate(this.rotate * Math.PI / 180);
    this.gameIns.ctx.translate(-this.left - this.width / 2, -this.top - this.height / 2);
    this.shape.draw('bird', this.left, this.top, this.width, this.height);
    this.gameIns.ctx.restore();
  };

  // 鸟进行位移
  Bird.prototype.setPosition = function setPosition () {
  		var this$1 = this;

  		this.timer = setInterval(function () {
      this$1.top -= 5;
      if (this$1.rotate > -45) {
        if (this$1.rotate > 10) {
          this$1.rotate -= 5;
        } else {
          this$1.rotate -= 3;
        }
      }
  		}, 1000 / 60);
  		
  		this.timer2 = setTimeout(function () {
  			clearInterval(this$1.timer);
  		}, 300);
  };
    
  //模拟重力
  Bird.prototype.gravity = function gravity () {
    this.g *= 1.05;
    this.top += this.g;
    if (this.rotate < 60) {
      if (this.rotate < 10) {
        this.rotate += 2;
      } else {
        this.rotate += 1.3;
      }
    }
  };

  // 重置定时器
  Bird.prototype.reset = function reset () {
    clearInterval(this.timer);
    clearTimeout(this.timer2);
  };
    
  // 碰撞检测
  Bird.prototype.isCollision = function isCollision (pipeList) {
      var this$1 = this;

    // 碰到上下边界,游戏结束
    if(this.top < 0 || this.top > this.gameIns.height) {
      this.gameIns.gameOver();
    } else {
      for(var i = 0, l = pipeList.length; i < l; i++) {
        var p = pipeList[i];
        if(p && p.isPass == false) {
          if(p.left <= (this$1.left + this$1.width) && p.left > (this$1.left - p.width)) {
            if(
              this$1.top < p.height ||
              this$1.top > (p.height + this$1.gameIns.gapHeight - this$1.height)
            ) {
              this$1.gameIns.gameOver();
            }
          } else if (p.left < (this$1.left - p.width)) {
            // 通过
            this$1.gameIns.s_point.play(); //播放音效
            this$1.gameIns.score += 1;
            p.isPass = true;
          }
        }
      }
    }
  };

  var Pipe = function Pipe(id, gameIns) {
    this.gameIns = gameIns;
    this.id = id;
    this.isPass = false;
    this.ctx = gameIns.ctx;
    this.left = gameIns.width;
    this.top = 0;
    this.width = 50;
    this.height = getRandom(gameIns.height / 2- 200, gameIns.height / 2 + 100);
  };

  //利用随机数随机生成上管道高度，下管道与上管道距离固定
  Pipe.prototype.draw = function draw () {
    this.gameIns.shape.draw('pipe_down', this.left, this.top, this.width, this.height); //上管道
    this.gameIns.shape.draw(
      'pipe_up',
      this.left,
      this.gameIns.gapHeight + this.height,
      this.width,
      this.gameIns.height - this.height - this.gameIns.gapHeight
    ); //下管道
  };

  //管道左移。我们的所有生成的管道放在数组pipeList中，为了优化性能，
  //判断每一个管道是否移出屏幕，移出的时候将其置为null,不再渲染
  Pipe.prototype.move = function move () {
    this.left -= this.gameIns.SpeedX;
    //出界后不再渲染
    if(this.left < -50) {
      this.gameIns.pipeList[this.id] = null;
    }
  };

  var Game = function Game() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.width = document.body.clientWidth;
    this.canvas.height = this.height = document.body.clientHeight;
    this.gapHeight = 150; // 上下管道之间的距离
    this.gapPipe = 2500; // 管道循环生成间隔 ms
    this.SpeedX = 1.5; // 管道左移速度
    this.intval = 1000 / 60; //重绘速度ms
    this.score = 0; //得分
    this.bestScore = 0;
    this.lastScore = 0;
    this.id = 0; //一组管道的唯一标示
    this.pipeList = []; //管道对象的数组
    this.isCover = true;
    this.isReady = false;
    this.timer = null; //整体run的定时器
    this.pipe_timer = null; //管道循环生成的定时器
    this.bird = null;
    this.handler1 = null;
    this.handler2 = null;
    this.s_click = null;
    this.s_die = null; // 死亡音效对象
    this.s_wing = null; // 飞翔音效对象
    this.s_point = null; // 得分音效对象
    this.s_hit = null; // 碰撞音效对象
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
      this$1.drawBg();
      this$1.drawCover();
      // 开始游戏按钮监听
      this$1.coverListener();
        
      // 初始化音效
  		this$1.initSound();
  		};
  };

  // 初始化音效
  	Game.prototype.initSound = function initSound () {
  		this.s_click = new Audio("source/sfx_point.ogg");
  		this.s_wing = new Audio("source/sfx_wing.ogg");
  		this.s_point = new Audio("source/sfx_point.ogg");
    this.s_hit = new Audio("source/sfx_hit.ogg");
  	};
    
  Game.prototype.getTime = function getTime () {
  		return new Date().getHours();
  };

  Game.prototype.drawBg = function drawBg () {
    if (this.getTime() < 19 && this.getTime() > 6) {
      this.shape.draw('bg_day', 0, 0, this.width, this.height);
    } else {
      this.shape.draw('bg_night', 0, 0, this.width, this.height);
    }
  };
    
  //绘制封面
  	Game.prototype.drawCover = function drawCover () {
    var h = this.height / 2 - 300;
    this.btnX = (this.width - 116) / 2;
    this.btnY = 350 + h;
    this.shape.draw('title', (this.width - 178) / 2, 100 + h, 178, 48);
    this.shape.draw('button_play', this.btnX, this.btnY, 116, 70);
    this.shape.draw('tutorial', (this.width - 114) / 2, 200 + h, 114, 98);
  	};
    
  Game.prototype.coverListener = function coverListener () {
  		var this$1 = this;

  		this.handler2 = function (e) {
  			var theEvent = window.event || e;
      var p = getEventPosition(theEvent);
  				
  			if(p.x > this$1.btnX && p.x < this$1.btnX + 116 && p.y > this$1.btnY && p.y < this$1.btnY + 70) {
  				this$1.isControl = true;
        this$1.bird = new Bird(this$1);
        this$1.s_click.play(); // 播放音效
          
        removeEvent(this$1.canvas, this$1.eventType.start, this$1.handler2); //点击之后就移除该按钮点击

        this$1.ctx.clearRect(0, 0, this$1.width, this$1.height);
        this$1.drawBg();
        this$1.shape.draw('text_ready', (this$1.width - 178) / 2, this$1.height / 2 - 100, 204, 54);
        setTimeout(function () {
          this$1.reset();
          this$1.run();
          //循环生成管道
          this$1.startPipe();
          this$1.initListener();
        }, 1500);
  			}
  			
  		};
  		addEvent(this.canvas, this.eventType.start, this.handler2);
  };

  //绘制得分
  	Game.prototype.drawScore = function drawScore (score, fontSize, left, top, color) {
  		this.ctx.save();
  		this.ctx.font = "Bold " + fontSize + "px Arial";
  		this.ctx.textAlign = 'right';
  		this.ctx.fillStyle = color;
  		this.ctx.shadowOffsetX = 3; // 设置水平位移
  		this.ctx.shadowOffsetY = 3; // 设置垂直位移
  		this.ctx.shadowBlur = 3; // 设置模糊度
  		this.ctx.shadowColor = 'black'; // 设置阴影颜色
  		this.ctx.fillText(score, left, top);
  		this.ctx.restore();
  	};

  //绘制分数牌
  	Game.prototype.drawScorePanel = function drawScorePanel () {
  		this.shape.draw('score_panel', (this.width - 238) / 2, this.height / 2 - 100, 238, 126);
  };

  	//绘制奖牌
  	Game.prototype.drawMedal = function drawMedal () {
    // 判断游戏结束时给哪个奖牌
  		if(this.score < 20) {
      this.shape.draw('medals_0', (this.width - 44) / 2 - 66, this.height / 2 - 54, 44, 44);
  		} else if (this.score < 50) {
      this.shape.draw('medals_3', (this.width - 44) / 2 - 66, this.height / 2 - 54, 44, 44);
  		} else if (this.score < 100) {
      this.shape.draw('medals_2', (this.width - 44) / 2 - 66, this.height / 2 - 54, 44, 44);
  		} else {
      this.shape.draw('medals_1', (this.width - 44) / 2 - 66, this.height / 2 - 54, 44, 44);
  		}
  	};

  Game.prototype.run = function run () {
      var this$1 = this;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBg();

    // 循环绘制管道数组
    for(var i = 0, l = this.pipeList.length; i < l; i++) {
      var p = this$1.pipeList[i];
      if(p){
        p.draw();
        p.move();
      }
    }
      
    //分数
    this.drawScore(this.score, 50, this.width - 20, 50, '#fff');
      
    // 绘制鸟
    this.bird.draw();
    this.bird.gravity();
      
    // 碰撞检测
    this.bird.isCollision(this.pipeList);
    this.timer = requestAnimationFrame(this.run.bind(this));
  };

  //绘制gameover
  	Game.prototype.drawGameOver = function drawGameOver () {
    this.shape.draw('text_game_over', (this.width - 178) / 2, this.height / 2 - 100, 204, 54);
  };
    
  Game.prototype.gameOver = function gameOver () {
  		var this$1 = this;

  		// 更新最高分
  		this.s_hit.play(); // 播放音效
    this.stop();
    setTimeout(function () {
      this$1.drawGameOver();
    }, 1000);
    setTimeout(function () {
      this$1.drawBg();
      this$1.shape.draw('title', (this$1.width - 178) / 2, this$1.height / 2 - 200, 178, 48);
      this$1.drawScorePanel();
      this$1.drawMedal();
      this$1.drawScore(this$1.score, 20, (this$1.width - 178) / 2 + 170, this$1.height / 2 - 50, '#fff');
      this$1.drawScore(this$1.bestScore, 20, (this$1.width - 178) / 2 + 170, this$1.height / 2 - 4, '#fff');
      this$1.shape.draw('button_play', this$1.btnX, this$1.btnY, 116, 70);
        
      if(this$1.bestScore < this$1.score) {
        this$1.bestScore = this$1.score;
      }
      this$1.lastScore = this$1.score;
      removeEvent(this$1.canvas, this$1.eventType.start, this$1.handler1);
      addEvent(this$1.canvas, this$1.eventType.start, this$1.handler2);
    }, 2000);
  };
    
  //开始循环生成管道
  	Game.prototype.startPipe = function startPipe () {
  		var this$1 = this;

  		this.pipe_timer = setInterval(function () {
  			var id = this$1.pipeList.length;
  			this$1.drawPipe(id);
  		}, this.gapPipe);	
  };
    
  Game.prototype.drawPipe = function drawPipe (id) {
  		var p = new Pipe(id, this);
  		this.pipeList.push(p);
  };
    
  Game.prototype.initListener = function initListener () {
  		var this$1 = this;

  		this.handler1 = function (e) {
  			var theEvent = window.event || e;
  			var p = getEventPosition(theEvent);
  			
  			this$1.s_wing.play(); //播放音效
      this$1.bird.reset(); // 清空上次点击事件
      this$1.bird.setPosition(); //鸟进行位移
      this$1.bird.g = 1; //重置g
  		};
  		
  		addEvent(this.canvas, this.eventType.start, this.handler1);
  	};
    
  // 停止run方法的递归调用
  	Game.prototype.stop = function stop () {
      var this$1 = this;

    setTimeout(function () {
      window.cancelAnimationFrame(this$1.timer);
      clearInterval(this$1.pipe_timer);
    }, 0);
  };

  	Game.prototype.reset = function reset () {
  		this.pipeList = [];
  		this.score = 0;
  		this.timer = null;
  		this.pipe_timer = null;
  	};

  function index () {
    var game = new Game();
    game.init();
  }

  return index;

})));
