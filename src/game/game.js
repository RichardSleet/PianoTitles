
import config from '../config/index.js';
import tool from '../utils/index.js';

export default class Game {
  constructor(canvas, context, gameSetting) {
    //成员变量
    this.canv = canvas;
    this.ctx = context;
    this.showBlocks = [];
    this.clickBlocksCount = 1;
    this.readyFirst = 0;
    if (!Game.gs) {
      Game.gs = config(canvas);
    }
  }
  //准备游戏
  readyGame() {
    this.showBlocks = tool.blocksFactory(Game.gs, 'ready', this.ctx);
  }
  //停止游戏
  stopGame() {

  }
  //开始游戏
  beginGame() {
    this.readyGame();
    var ctx = this.ctx;
    //运行游戏的线程
    requestAnimationFrame(this.animationCallBack.bind(this))
    wx.onTouchStart(this.clickBlocks.bind(this))
  }
  clickBlocks(args) {
    //得到点击区域
    let x = args.touches[0].clientX;
    let y = args.touches[0].clientY;
    //得到点击块
    let BlockX = Math.floor(x / Game.gs.aBlock.width);
    let BlockY;
    for (let i = Game.gs.rowBlockNums; i >= 0; i--) {
      var distance = y - this.showBlocks[i][0].y;
      if (distance <= Game.gs.aBlock.height && distance >= 0) {
        BlockY = i;
        break;
      }
    }
    let shouldClickBlockY = 4 - this.clickBlocksCount;
    //判断是否点中白块最后一行的黑块
    console.log('应该点击:', this.clickBlocksCount,'实际点击:',BlockY);
    if (BlockY < shouldClickBlockY) {
        return;
    } else if (this.showBlocks[BlockY][BlockX].color == Game.gs.normalBlockColor ) {
      //点击成功
      this.showBlocks[BlockY][BlockX].clickSuccess();
      this.clickBlocksCount++
    } else{
      //点击失败
      this.showBlocks[BlockY][BlockX].clickError();
    }
  }
  //维护动画
  animationCallBack() {
    var ctx = this.ctx;
    this.checkShowBlocks();
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
    var ctx = this.ctx;
    var canv = this.canv;
    var showBlocks = this.showBlocks;
    var offsetYLast = this.showBlocks[this.showBlocks.length - 1][0].y;
    var offsetYFirst = this.showBlocks[0][0].y;

    //是否需要进队列
    if (offsetYFirst >= 0) {
      //进队列
      showBlocks.unshift(tool.blocksFactory(Game.gs, 'pushRow', ctx)(offsetYFirst - Game.gs.aBlock.height));
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
      this.readyFirst = 1;
    }
  }
}