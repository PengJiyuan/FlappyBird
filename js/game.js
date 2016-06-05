var canvas = document.getElementById("main"),
	ctx = main.getContext("2d");
	
function Bird() {
	this.left = 120;
	this.top = 250;
	this.width = 34;
	this.height = 24;
	this.g = 1;
	this.timer = null;
	this.timer2 = null;
	this.pic = gameMonitor.im.createImage('images/bird.png');
	this.draw = function() {
		ctx.drawImage(this.pic, this.left, this.top, this.width, this.height);
	}
	this.setPosition = function() {
		var _this = this;
		
		this.timer = setInterval(function(){
			_this.top -= 5;
		},1000/60);
		
		this.timer2 = setTimeout(function() {
			clearInterval(_this.timer);
		},300);
		
	}
	this.gravity = function() {
		this.g *= 1.06; 
		this.top += this.g;
	}
	this.isStop = function() {
		if(this.top < 0) {
			this.top = 10;
		}else if(this.top > 480) {
		
			gameMonitor.stop();
			
		}
	}
	this.reset = function() {
		clearInterval(this.timer);
		clearTimeout(this.timer2);
	}
	//碰撞检测
	this.isCollision = function(pipeList) {
		var _this = this;
		//碰到上下边界,游戏结束
		if(_this.top < 0 || this.top > 480) {
		
			gameMonitor.gameOver();
			
		}else {
			for(var i = 0,l = pipeList.length; i < l; i++){
				var p = pipeList[i];
				if(p && p.isPass == false) {
					if(p.left <= (_this.left + _this.width) && p.left > (_this.left - p.width)) {
						if(_this.top < p.height || _this.top > (p.height + gameMonitor.gapHeight - _this.height)) {
							setTimeout(function() {
								gameMonitor.gameOver();
							},0);	
						}
					}else if(p.left < (_this.left - p.width)) {
						gameMonitor.s_point.play();//播放音效
						gameMonitor.score += 1;
						p.isPass = true;
					}
				}
			}
		}
	}
}  

function Pipe(id) {
	this.id = id;
	this.isPass = false;
	this.left = gameMonitor.bgWidth;
	this.top = 0;
	this.width = 50;
	this.height = getRandom(100,200);
	this.pic_down = gameMonitor.im.createImage('images/pipe_down.png');
	this.pic_up = gameMonitor.im.createImage('images/pipe_up.png');
}
Pipe.prototype.draw = function() {
	ctx.drawImage(this.pic_down, this.left, this.top, this.width, this.height); //上管道       	
	ctx.drawImage(this.pic_up, this.left, gameMonitor.gapHeight + this.height, this.width, 280);//下管道        	
}
Pipe.prototype.move = function() {
	this.left -= gameMonitor.SpeedX;
	if(this.left < -50) {
		gameMonitor.pipeList[this.id] = null;
	}//出界后不再渲染
	
}

//获得start到end的随机数
function getRandom(start, end) {
	var intval = end - start;
	return Math.round(Math.random() * intval + start);
}
//图片加载器
function ImageMonitor(){
	var imgArray = [];
	return {
		createImage : function(src){
			return typeof imgArray[src] != 'undefined' ? imgArray[src] : (imgArray[src] = new Image(), imgArray[src].src = src, imgArray[src])
		},
		loadImage : function(arr, callback){
			for(var i=0,l=arr.length; i<l; i++){
				var img = arr[i];
				imgArray[img] = new Image();
				imgArray[img].onload = function(){
					if(i==l-1 && typeof callback=='function'){
						callback();
					}
				}
				imgArray[img].src = img
			}
		}
	}
}
/*function isIphone(){//判断是否是移动设备
	var sUserAgent= navigator.userAgent.toLowerCase(),
	bIsIpad= sUserAgent.match(/ipad/i) == "ipad",
	bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os",
	bIsMidp= sUserAgent.match(/midp/i) == "midp",
	bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
	bIsUc= sUserAgent.match(/ucweb/i) == "ucweb";
	return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc);
}*/
function IsPC() 
{ 
    var userAgentInfo = navigator.userAgent; 
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", "Mobile"); 
    var flag = true; 
    for (var v = 0; v < Agents.length; v++) { 
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; } 
    } 
    return flag; 
} 
//时间绑定、解绑
var EventUtil = {

    addEvent: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },

	removeEvent: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    }

}
//获取点击的坐标
function getEventPosition(ev){
  var x, y;
  if(ev.touches) {
	x = ev.touches[0].pageX;
    y = ev.touches[0].pageY;
  }else if (ev.layerX || ev.layerX == 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) { // Opera
    x = ev.offsetX;
    y = ev.offsetY;
  }
  return {x: x, y: y};
}
	
var gameMonitor = {
	bgWidth: 320,
	bgHeight: 480,
	gapHeight: 100,//上下管道之间的距离
	gapPipe: 2500,//管道循环生成间隔 ms
	SpeedX: 1.5,//管道左移速度
	intval: 1000/60,//重绘速度  ms
	score: 0,//得分
	bestScore: 0,
	lastScore: 0,
	id: 0,//一组管道的唯一标示
	pipeList: [],//管道对象的数组
	isCover: true,
	isReady: false,
	isControl: true,//是否可以点击暂停或运行
	isPause: false,//是否是暂停状态
	timer: null,//整体run的定时器
	pipe_timer: null,//管道循环生成的定时器
	bird: null,
	handler1: null,
	handler2: null,
	s_die: null,//音效对象
	s_wing: null,//音效对象
	s_point: null,//音效对象
	s_hit: null,//音效对象
	eventType: {
		start : IsPC() ? 'mousedown' : 'touchstart'
	},
	im: new ImageMonitor(),
	getTime: function() {
		var myDate = new Date();
		return myDate.getHours();
	},//获取当前小时数，判断用白天还是黑夜背景
	init: function() {
		gameMonitor.im.loadImage(['images/bg_day.png','images/bg_night.png','images/button_pause.png','images/button_resume.png','images/bird.png', 'images/tutorial.png','images/button_play.png','images/title.png','images/text_ready.png','images/pipe_down.png','images/pipe_up.png','images/score_panel.png','images/text_game_over.png']);
		var _this = this;
			
		var bg = new Image();
		_this.bg = bg;
		bg.onload = function(){
          	ctx.drawImage(bg, 0, 0, _this.bgWidth, _this.bgHeight);          	
		}
		if(_this.getTime() < 19 && _this.getTime() > 6) {
			bg.src = 'images/bg_day.png';	
		}else {
			bg.src = 'images/bg_night.png';
		}
		setTimeout(function() {
			_this.drawCover();	
		},200);
		
		_this.initSound();
		//初始化音效
		//document.getElementsByClassName("author")[0].innerHTML = navigator.userAgent;
		//开始游戏按钮监听
		_this.coverListener();		
		
	},
	coverListener:function() {
		
		_this = this;
		_this.handler2 = function(e){
		
			var theEvent = window.event || e;
			var p = getEventPosition(theEvent);
				
			if(p.x > 100 && p.x < 216 && p.y > 350 && p.y < 420) {
				
				_this.isControl = true;
				_this.bird = new Bird();
				
				_this.s_click.play();//播放音效
				_this.reset();
				_this.run();
				//循环生成管道
				_this.startPipe();
				EventUtil.removeEvent(main, _this.eventType.start,_this.handler2);//点击之后就移除该按钮点击
				_this.initListener();				
			}
			
		}
		EventUtil.addEvent(main, _this.eventType.start, _this.handler2);
		
	},
	initListener: function() {
		var _this = this;
		
		_this.handler1 = function(e){
			var theEvent = window.event || e;
			var p = getEventPosition(theEvent);
			
			//判断是否点击暂停按钮
			if(p.x > 270 && p.x < 296 && p.y > 20 && p.y < 48) {

				if(_this.isControl == true) {
					if(_this.isPause == false) {
						
						_this.s_click.play();
						_this.isPause = true;
						
						setTimeout(function() {					
							gameMonitor.stop();	
							gameMonitor.drawPause(_this.isPause);					
						},1000/60);	
						
					}else {
						_this.s_click.play();
						_this.isPause = false;
						gameMonitor.run();
						gameMonitor.startPipe();
					}
				}
				
			}else {
				_this.s_wing.play();//播放音效
				_this.bird.reset();//清空上次点击事件
				_this.bird.setPosition();//鸟进行位移
				_this.bird.g = 1;//重置g	
			}
		};
		
		EventUtil.addEvent(main, _this.eventType.start, _this.handler1);
	},
	run: function() {
		var _this = this;
		ctx.clearRect(0, 0, _this.bgWidth, _this.bgHeight);
		_this.drawBg();//绘制背景

		//循环绘制管道数组
		for(var i = 0,l = this.pipeList.length;i < l;i++) {
			var p = _this.pipeList[i];
			if(p){
				p.draw();
				p.move();
			}
		}
		//暂停开关控制		
		_this.drawPause(_this.isPause);
		
		//分数
		_this.drawScore(_this.score,50,140,100,'#fff');	
		
		//绘制鸟
		_this.bird.draw();//重绘鸟
		_this.bird.gravity();
		
		//碰撞检测
		_this.bird.isCollision(_this.pipeList);
		
		_this.timer = setTimeout(function() {
			_this.run();
		},_this.intval);
		//requestAnimationFrame(_this.run(ctx));	
		
	},
	//初始化音效
	initSound: function() {
		this.s_click = new Audio("sound/sfx_point.ogg");
		this.s_wing = new Audio("sound/sfx_wing.ogg");
		this.s_point = new Audio("sound/sfx_point.ogg");
		this.s_hit = new Audio("sound/sfx_hit.ogg");
	},
	//开始循环生成管道
	startPipe: function() {
		var _this = this;
		_this.pipe_timer = setInterval(function() {
			var id = _this.pipeList.length;
			_this.drawPipe(id);
		},_this.gapPipe);	
	},
	//绘制背景
	drawBg: function() {
		ctx.drawImage(this.bg, 0, 0, this.bgWidth, this.bgHeight);
	},
	drawPipe: function(id) {
		var p = new Pipe(id);
		this.pipeList.push(p);
	},
	//绘制封面
	drawCover: function() {
	
		setTimeout(function() {
			ctx.drawImage(gameMonitor.im.createImage("images/title.png"), 80, 100, 178, 48);
			ctx.drawImage(gameMonitor.im.createImage("images/button_play.png"), 100, 350, 116, 70);
			ctx.drawImage(gameMonitor.im.createImage("images/tutorial.png"), 100, 200, 114, 98);
			
		},1000/60);	
		
	},
	//绘制得分
	drawScore: function(score, fontSize, left, top, color) {
		ctx.save();
		ctx.font = "Bold "+ fontSize +"px Arial";
		ctx.textAlign = "left";
		ctx.fillStyle = color;
		ctx.shadowOffsetX = 3; // 设置水平位移
		ctx.shadowOffsetY = 3; // 设置垂直位移
		ctx.shadowBlur = 3; // 设置模糊度
		ctx.shadowColor = "black"; // 设置阴影颜色
		ctx.fillText(score,left,top);
		ctx.restore();
	},
	gameOver: function() {
		var _this = this;
		_this.isControl = false;//游戏结束后不可以点击暂停或运行
		//更新最高分
		_this.s_hit.play();//播放音效
		setTimeout(function() {
			
			gameMonitor.stop();
			gameMonitor.drawGameOver();
			setTimeout(function() {
				gameMonitor.drawBg();
				ctx.drawImage(gameMonitor.im.createImage("images/title.png"), 80, 100, 178, 48);
				gameMonitor.drawScorePanel();
				gameMonitor.drawMedal();
				gameMonitor.drawScore(_this.score,20,230,250,'#fff');
				gameMonitor.drawScore(_this.bestScore,20,230,295,'#fff');
				ctx.drawImage(gameMonitor.im.createImage("images/button_play.png"), 100, 350, 116, 70);
				
				if(_this.bestScore < _this.score) {
					_this.bestScore = _this.score;
				}
				_this.lastScore = _this.score;
				EventUtil.removeEvent(main, _this.eventType.start, _this.handler1);
				EventUtil.addEvent(main, _this.eventType.start, _this.handler2);
			},1000);
			
		},1000/60);//无解
	},
	//绘制gameover
	drawGameOver: function() {
		ctx.drawImage(gameMonitor.im.createImage('images/text_game_over.png'), 50, 200, 204, 54);
	},
	//绘制暂停按钮
	drawPause: function(bol) {
		if(bol == false) {
			ctx.drawImage(gameMonitor.im.createImage('images/button_pause.png'), 270, 20, 26, 28);
		}else {
			ctx.drawImage(gameMonitor.im.createImage('images/button_resume.png'), 270, 20, 26, 28);
		}	
	},
	//绘制分数牌
	drawScorePanel: function() {
		ctx.drawImage(gameMonitor.im.createImage('images/score_panel.png'), 45, 200, 238, 126);
	},
	//绘制奖牌
	drawMedal: function() {
	
		var _this = this;
		//判断游戏结束时给哪个奖牌
		if(_this.score > _this.bestScore) {
			ctx.drawImage(gameMonitor.im.createImage('images/medals_1.png'), 76, 245, 44, 44);
		}else if(_this.score > _this.lastScore && _this.score > 20) {
			ctx.drawImage(gameMonitor.im.createImage('images/medals_2.png'), 76, 245, 44, 44);
		}else if(_this.score > 10) {
			ctx.drawImage(gameMonitor.im.createImage('images/medals_3.png'), 76, 245, 44, 44);
		}else {
			ctx.drawImage(gameMonitor.im.createImage('images/medals_0.png'), 76, 245, 44, 44);
		}	
		
	},
	//停止run方法的递归调用
	stop: function() {
		var _this = this;
		setTimeout(function(){
			clearTimeout(_this.timer);
			clearTimeout(_this.pipe_timer);		
		}, 0);
	},
	reset: function() {
		this.pipeList = [];
		this.score = 0;
		this.timer = null;
		this.pipe_timer = null;
	}
}
gameMonitor.init();