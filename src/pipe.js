class Pipe {
  constructor(id, ctx) {
    this.id = id;
    this.ctx = ctx;
    this.isPass = false;
    this.left = gameMonitor.bgWidth;
    this.top = 0;
    this.width = 50;
    this.height = getRandom(100,200);
    this.pic_down = gameMonitor.im.createImage('images/pipe_down.png');
    this.pic_up = gameMonitor.im.createImage('images/pipe_up.png');
  }

  //利用随机数随机生成上管道高度，下管道与上管道距离固定
  draw() {
    this.ctx.drawImage(this.pic_down, this.left, this.top, this.width, this.height); //上管道       	
    this.ctx.drawImage(this.pic_up, this.left, gameMonitor.gapHeight + this.height, this.width, 280);//下管道        	
  }
  //管道左移。我们的所有生成的管道放在数组pipeList中，为了优化性能，
  //判断每一个管道是否移出屏幕，移出的时候将其置为null,不再渲染
  move() {
    this.left -= gameMonitor.SpeedX;
    if(this.left < -50) {
      gameMonitor.pipeList[this.id] = null;
    }//出界后不再渲染
  }
} 
