

class Bird {
  constructor(gameIns) {
    this.gameIns = gameIns;
    this.shape = gameIns.shape;
    this.width = 34;
    this.height = 24;
    this.left = (gameIns.width - this.width) / 2;
    this.top = (gameIns.height - this.height) / 2 - 100;
    this.g = 1; // 重力
    this.timer = null;
    this.timer2 = null;
  }

  draw() {
    this.shape.draw('bird', this.left, this.top, this.width, this.height);
  }

  //鸟进行位移
  setPosition() {
		this.timer = setInterval(() => {
			this.top -= 5;
		}, 1000 / 60);
		
		this.timer2 = setTimeout(() => {
			clearInterval(this.timer);
		}, 300);
  }
  
  //模拟重力
  gravity() {
    this.g *= 1.05;
    this.top += this.g;
  }

  //是否停止位移
  isStop() {
    if(this.top < 0) {
      this.top = 10;
    } else if(this.top > 480) {
      gameIns.stop();
    }
  }

  // 重置定时器
  reset() {
    clearInterval(this.timer);
    clearTimeout(this.timer2);
  }
  
  // 碰撞检测
  isCollision(pipeList) {
    // 碰到上下边界,游戏结束
    if(this.top < 0 || this.top > this.gameIns.height) {
      this.gameIns.gameOver();
    } else {
      for(let i = 0, l = pipeList.length; i < l; i++) {
        var p = pipeList[i];
        if(p && p.isPass == false) {
          if(p.left <= (this.left + this.width) && p.left > (this.left - p.width)) {
            if(
              this.top < p.height ||
              this.top > (p.height + this.gameIns.gapHeight - this.height)
            ) {
              this.gameIns.gameOver();
            }
          } else if (p.left < (this.left - p.width)) {
            // 通过
            // this.gameIns.s_point.play(); //播放音效
            this.gameIns.score += 1;
            p.isPass = true;
          }
        }
      }
    }
  }
}

export default Bird;
