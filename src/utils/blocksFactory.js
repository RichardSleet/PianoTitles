import block from '../../src/game/block.js';
import utils from '../../src/utils/utils.js';
/** 
 *   gs: Object 游戏的全局配置
 *   mode: String 枚举为'ready','pushRow'中的一个
*/
var gs; 
var ctx;
const blocksFactory = function _blocksFactory(mode) {
    ctx = wx.PTContext;
    if(!gs){
      gs = wx.PTConfig;
    }
    let result;
    switch(mode){
      //绘制准备页面块
      case 'ready':
        result = readyMode();
        break;
      //绘制一行块
      case 'pushRow':
        result = pushRowMode();
        break;
      default:
        throw Error('没有找到mode对应匹配项');
    }
    return result;
}
const readyMode = function _readyMode(){
  //填充屏幕blocks
  var showBlocks = [];
  for (let row = 0; row < gs.rowBlockNums; row++) {
    //得到一个黑块随机数
    let blackBlockIndex = utils.getRandomInt(4);
    showBlocks.push([])
    for (let col = 0; col < gs.colBlockNums; col++) {
      if (row == (gs.rowBlockNums - 1)) {
        //黄色准备区域
        //这个构造函数实在是需要优化优化了
        showBlocks[row][col] = new block(
          col * gs.aBlock.width,
          row * gs.aBlock.height,
          gs.aBlock.width,
          gs.aBlock.height,
          gs.prepareBlockColor,
        )
      } else {
        //黑白区域
        showBlocks[row][col] = new block(
          col * gs.aBlock.width,
          row * gs.aBlock.height,
          gs.aBlock.width,
          gs.aBlock.height,
          blackBlockIndex == col ? gs.normalBlockColor : gs.abnormalBlockColor,
          gs,
          ctx
        )
      }
    }
  }
  return showBlocks;
}
//返回一个闭包,参数是row的y坐标
const pushRowMode = function _pushRowMode(){
  return function(offsetY){
    let pushRowBlocksArr = [];
    //得到一个黑块随机数
    let blackBlockIndex = utils.getRandomInt(4);
    for (let col = 0; col < gs.colBlockNums; col++) {
        //黑白区域
        pushRowBlocksArr.push(new block(
          col * gs.aBlock.width,
          offsetY,
          gs.aBlock.width,
          gs.aBlock.height,
          blackBlockIndex == col ? gs.normalBlockColor : gs.abnormalBlockColor,
          gs,
          ctx
        ));
    }
    return pushRowBlocksArr;
  }
}
export default blocksFactory;