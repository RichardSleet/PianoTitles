/**
 * 小游戏Game实例控制游戏的进度
 */
import config from '../config/index.js';
import tool from '../utils/index.js';

export default class Game {
  constructor() {
    //当前显示的block块实例
    this.showBlocks = [];
    //点击块数量
    this.clickBlocksCount = 1;
    //准备块Tag
    this.readyFirst = 0;
  }
  //准备游戏
  readyGame() {
    //制造准备块
    this.showBlocks = tool.blocksFactory('ready');
  }
  //停止游戏
  stopGame() {
  }
  //开始游戏
  beginGame() {
    this.readyGame();
    //运行游戏的线程
    requestAnimationFrame(this.animationCallBack.bind(this));
    wx.onTouchStart(this.clickBlocks.bind(this));
  }
  /**
   * 获取点击作用域
   */
  clickBlocks(args) {
    //得到点击区域
    let x = args.touches[0].clientX;
    let y = args.touches[0].clientY;
    //得到点击块
    let BlockX = Math.floor(x / wx.PTConfig.aBlock.width);
    let BlockY;
    for (let i = wx.PTConfig.rowBlockNums; i >= 0; i--) {
      var distance = y - this.showBlocks[i][0].y;
      if (distance <= wx.PTConfig.aBlock.height && distance >= 0) {
        BlockY = i;
        break;
      }
    }
    let shouldClickBlockY = 4 - this.clickBlocksCount;
    //判断是否点中白块最后一行的黑块
    console.log('应该点击:', this.clickBlocksCount,'实际点击:',BlockY);
    if (BlockY < shouldClickBlockY) {
        return;
    } else if (this.showBlocks[BlockY][BlockX].color == wx.PTConfig.normalBlockColor ) {
      //点击成功
      this.showBlocks[BlockY][BlockX].clickSuccess();
      this.clickBlocksCount++;
    } else{
      //点击失败
      this.showBlocks[BlockY][BlockX].clickError();
    }
  }
  //游戏运行线程
  animationCallBack() {
    //检查是否需要出块,入块
    this.checkShowBlocks();
    //绘制下一帧
    this.showBlocks.forEach(el => {
      el.forEach(el => {
        //绘制白块
        el.drawMyself();
        //速度
        el.y = 5;
      })
    })
    requestAnimationFrame(this.animationCallBack.bind(this));
  }
  //维护队列
  checkShowBlocks() {
    var canv = this.canv;
    var showBlocks = this.showBlocks;
    var offsetYLast = this.showBlocks[this.showBlocks.length - 1][0].y;
    var offsetYFirst = this.showBlocks[0][0].y;
    //是否需要进队列
    if (offsetYFirst >= 0) {
      //进队列
      showBlocks.unshift(tool.blocksFactory('pushRow')(offsetYFirst - wx.PTConfig.aBlock.height));
      if (this.readyFirst) {
        this.readyFirst = true;
        //出队列
        showBlocks.pop();
        if (this.clickBlocksCount > 0) {
          this.clickBlocksCount--;
        } else {
          throw new Error('游戏结束');
        }
      }
      //出去准备队列的tag
      this.readyFirst = 1;
    }
  }
}