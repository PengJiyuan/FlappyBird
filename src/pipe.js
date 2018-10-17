import { getRandom } from './utils';

class Pipe {
  constructor(id, gameIns) {
    this.gameIns = gameIns;
    this.id = id;
    this.isPass = false;
    this.ctx = gameIns.ctx;
    this.left = gameIns.width;
    this.top = 0;
    this.width = 50;
    this.height = getRandom(gameIns.height / 2  - 200, gameIns.height / 2 + 100);
  }

  //利用随机数随机生成上管道高度，下管道与上管道距离固定
  draw() {
    this.gameIns.shape.draw('pipe_down', this.left, this.top, this.width, this.height); //上管道
    this.gameIns.shape.draw(
      'pipe_up',
      this.left,
      this.gameIns.gapHeight + this.height,
      this.width,
      this.gameIns.height - this.height - this.gameIns.gapHeight
    ); //下管道
  }

  //管道左移。我们的所有生成的管道放在数组pipeList中，为了优化性能，
  //判断每一个管道是否移出屏幕，移出的时候将其置为null,不再渲染
  move() {
    this.left -= this.gameIns.SpeedX;
    //出界后不再渲染
    if(this.left < -50) {
      this.gameIns.pipeList[this.id] = null;
    }
  }
}

export default Pipe;
