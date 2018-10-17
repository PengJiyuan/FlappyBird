// 画雪碧图

const images = {
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

class Shape {
  constructor(ctx, img) {
    this.ctx = ctx;
    this.img = img;
  }

  draw(name, x, y, width, height) {
    const pos = images[name];
    const sx = pos.x;
    const sy = pos.y;
    const sWidth = pos.w;
    const sHeight = pos.h;
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
    )
  }
}

export default Shape;
