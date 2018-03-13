import getConfig from './config/index';
import Game from './game/index'
const main = function _main() {
  var rootCanvas = wx.createCanvas();
  var rootCanvasContext = rootCanvas.getContext('2d');
  var config = getConfig(rootCanvas);
  var game = new Game(rootCanvas, rootCanvasContext, config);
  game.beginGame();
}

export default main;