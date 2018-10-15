import Game from './game';

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const game = new Game(ctx);

export default () => {
  console.log(game);
  game.init();
};
