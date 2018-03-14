//导入游戏配置文件
import getConfig from './config/index';
//导入游戏实例
import Game from './game/game';

export default function _main() {
  var rootCanvas = wx.createCanvas();
  var rootCanvasContext = rootCanvas.getContext('2d');
  var config = getConfig(rootCanvas);
  var game = new Game(rootCanvas, rootCanvasContext, config);
  game.beginGame();
};
