import {
  isPC,
  getEventPosition,
  addEvent,
  removeEvent
} from './utils';
import Shape from './shape';
import Bird from './bird';
import Pipe from './pipe';

class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.width = document.body.clientWidth;
    this.canvas.height = this.height = document.body.clientHeight;
    this.gapHeight = 150; // 上下管道之间的距离
    this.gapPipe = 2500; // 管道循环生成间隔 ms
    this.SpeedX = 1.5; // 管道左移速度
    this.intval = 1000 / 60; //重绘速度  ms
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
      this.drawBg();
      this.drawCover();
      //开始游戏按钮监听
		  this.coverListener();
		}

    //初始化音效
		// this.initSound();
  }
  
  getTime() {
		return new Date().getHours();
  }

  drawBg() {
    if (this.getTime() < 19 && this.getTime() > 6) {
      this.shape.draw('bg_day', 0, 0, this.width, this.height);
    } else {
      this.shape.draw('bg_night', 0, 0, this.width, this.height);
    }
  }
  
  //绘制封面
	drawCover() {
    const h = this.height / 2 - 300;
    this.btnX = (this.width - 116) / 2;
    this.btnY = 350 + h;
    this.shape.draw('title', (this.width - 178) / 2, 100 + h, 178, 48);
    this.shape.draw('button_play', this.btnX, this.btnY, 116, 70);
    this.shape.draw('tutorial', (this.width - 114) / 2, 200 + h, 114, 98);
	}
  
  coverListener() {
		this.handler2 = (e) => {
			var theEvent = window.event || e;
      var p = getEventPosition(theEvent);
				
			if(p.x > this.btnX && p.x < this.btnX + 116 && p.y > this.btnY && p.y < this.btnY + 70) {
				this.isControl = true;
				this.bird = new Bird(this);
        
        removeEvent(this.canvas, this.eventType.start, this.handler2); //点击之后就移除该按钮点击

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawBg();
        this.shape.draw('text_ready', (this.width - 178) / 2, this.height / 2 - 100, 204, 54);
        setTimeout(() => {
          // this.s_click.play();//播放音效
          this.reset();
          this.run();
          //循环生成管道
          this.startPipe();
          this.initListener();
        }, 1500);
			}
			
		}
		addEvent(this.canvas, this.eventType.start, this.handler2);
  }

  //绘制得分
	drawScore(score, fontSize, left, top, color) {
		this.ctx.save();
		this.ctx.font = `Bold ${fontSize}px Arial`;
		this.ctx.textAlign = 'right';
		this.ctx.fillStyle = color;
		this.ctx.shadowOffsetX = 3; // 设置水平位移
		this.ctx.shadowOffsetY = 3; // 设置垂直位移
		this.ctx.shadowBlur = 3; // 设置模糊度
		this.ctx.shadowColor = 'black'; // 设置阴影颜色
		this.ctx.fillText(score, left, top);
		this.ctx.restore();
	}

  //绘制分数牌
	drawScorePanel() {
		this.shape.draw('score_panel', (this.width - 238) / 2, this.height / 2 - 100, 238, 126);
  }

	//绘制奖牌
	drawMedal() {
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
	}

  run() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBg();

    // 循环绘制管道数组
    for(let i = 0, l = this.pipeList.length; i < l; i++) {
      var p = this.pipeList[i];
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
  }

  //绘制gameover
	drawGameOver() {
    this.shape.draw('text_game_over', (this.width - 178) / 2, this.height / 2 - 100, 204, 54);
  }
  
  gameOver() {
		// 更新最高分
		// _this.s_hit.play(); //播放音效
    this.stop();
    setTimeout(() => {
      this.drawGameOver();
    }, 1000);
    setTimeout(() => {
      this.drawBg();
      this.shape.draw('title', (this.width - 178) / 2, this.height / 2 - 200, 178, 48);
      this.drawScorePanel();
      this.drawMedal();
      this.drawScore(this.score, 20, (this.width - 178) / 2 + 170, this.height / 2 - 50, '#fff');
      this.drawScore(this.bestScore, 20, (this.width - 178) / 2 + 170, this.height / 2 - 4, '#fff');
      this.shape.draw('button_play', this.btnX, this.btnY, 116, 70);
      
      if(this.bestScore < this.score) {
        this.bestScore = this.score;
      }
      this.lastScore = this.score;
      removeEvent(this.canvas, this.eventType.start, this.handler1);
      addEvent(this.canvas, this.eventType.start, this.handler2);
    }, 2000);
  }
  
  //开始循环生成管道
	startPipe() {
		this.pipe_timer = setInterval(() => {
			var id = this.pipeList.length;
			this.drawPipe(id);
		}, this.gapPipe);	
  }
  
  drawPipe(id) {
		const p = new Pipe(id, this);
		this.pipeList.push(p);
  }
  
  initListener() {
		this.handler1 = (e) => {
			const theEvent = window.event || e;
			const p = getEventPosition(theEvent);
			
			// this.s_wing.play(); //播放音效
      this.bird.reset(); // 清空上次点击事件
      this.bird.setPosition(); //鸟进行位移
      this.bird.g = 1; //重置g
		};
		
		addEvent(this.canvas, this.eventType.start, this.handler1);
	}
  
  // 停止run方法的递归调用
	stop() {
    console.log(this.timer);
    setTimeout(() => {
      window.cancelAnimationFrame(this.timer);
      clearInterval(this.pipe_timer);
    }, 0);
  }

	reset() {
		this.pipeList = [];
		this.score = 0;
		this.timer = null;
		this.pipe_timer = null;
	}
}

export default Game;
