//导入游戏配置文件
import getConfig from './config/index';
//导入游戏实例
import Game from './game/game';

/**初始化游戏配置 */
export default function _main() {
  wx.PTCanvas = wx.createCanvas();
  wx.PTContext = wx.PTCanvas.getContext('2d');
  wx.PTConfig = getConfig(wx.PTCanvas);
  var game = new Game();
  game.beginGame();
};
