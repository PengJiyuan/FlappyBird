class Bird {
  constructor(ctx) {
    this.left = 120;
    this.top = 250;
    this.width = 34;
    this.height = 24;
    this.g = 1; // 重力
    this.timer = null;
    this.timer2 = null;
    this.pic = gameMonitor.im.createImage('images/bird.png');
  }

  draw() {
    ctx.drawImage(this.pic, this.left, this.top, this.width, this.height);
  }

  //鸟进行位移
  setPosition() {
		this.timer = setInterval(() => {
			this.top -= 4;
		}, 1000/60);
		
		this.timer2 = setTimeout(() => {
			clearInterval(this.timer);
		}, 300);
  }
  
  //模拟重力
  gravity() {
    this.g *= 1.04;
    this.top += this.g;
  }

  //是否停止位移
  isStop() {
    if(this.top < 0) {
      this.top = 10;
    } else if(this.top > 480) {
      gameMonitor.stop();
    }
  }

  //重置定时器
  reset() {
    clearInterval(this.timer);
    clearTimeout(this.timer2);
  }
  
  //碰撞检测
  isCollision(pipeList) {
    const _this = this;
    //碰到上下边界,游戏结束
    if(this.top < 0 || this.top > 480) {
      gameMonitor.gameOver();
    } else {
      for(let i = 0,l = pipeList.length; i < l; i++){
        var p = pipeList[i];
        if(p && p.isPass == false) {
          if(p.left <= (_this.left + _this.width) && p.left > (_this.left - p.width)) {
            if(_this.top < p.height || _this.top > (p.height + gameMonitor.gapHeight - _this.height)) {
              setTimeout(() => {
                gameMonitor.gameOver();
              }, 0);	
            }
          } else if (p.left < (_this.left - p.width)) {
            // 通过
            gameMonitor.s_point.play(); //播放音效
            gameMonitor.score += 1;
            p.isPass = true;
          }
        }
      }
    }
  }
}

export default Bird;
