import { isPC } from './utils';
import Shape from './shape';

class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.bgWidth = 320;
    this.bgHeight = 480,
    this.gapHeight = 100; //上下管道之间的距离
    this.gapPipe = 2500; //管道循环生成间隔 ms
    this.SpeedX = 1.5; //管道左移速度
    this.intval = 1000/60; //重绘速度  ms
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
  }

  init() {
		this.img = new Image();
    this.img.src = 'source/flappybird.png';
		this.img.onload = () => {
      this.shape = new Shape(this.ctx, this.img);
      this.shape.draw('bg_night', 0, 0, this.bgWidth, this.bgHeight);
		}
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
  }
  
  // coverListener() {
	// 	this.handler2 = (e) => {
	// 		var theEvent = window.event || e;
	// 		var p = getEventPosition(theEvent);
				
	// 		if(p.x > 100 && p.x < 216 && p.y > 350 && p.y < 420) {
				
	// 			_this.isControl = true;
	// 			_this.bird = new Bird();
				
	// 			_this.s_click.play();//播放音效
	// 			_this.reset();
	// 			_this.run();
	// 			//循环生成管道
	// 			_this.startPipe();
	// 			EventUtil.removeEvent(main, _this.eventType.start,_this.handler2);//点击之后就移除该按钮点击
	// 			_this.initListener();				
	// 		}
			
	// 	}
	// 	EventUtil.addEvent(main, _this.eventType.start, _this.handler2);
	// }
}

export default Game;
