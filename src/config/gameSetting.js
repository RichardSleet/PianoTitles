//import setting from './gameSetting';
/**临时配置 */
var setting = {
  "rowBlockNums": 4,
  "colBlockNums": 4,
  "errorClickColor": "red",
  "successClickColor": "gray",
  "forgetClickColor": "gray",
  "startSpeed": 0,
  "accelerationSpped": 0,
  "normalBlockColor": "black",
  "abnormalBlockColor": "white",
  "prepareBlockColor": "yellow",
  "strokeBlock":'gray',
  //0向下
  "direction": 0
} 
//初始化游戏的配置
const gameSetting = function _gameSetting(canvas){
  //每个块的配置
  const aBlock = {
    width: canvas.width / setting.colBlockNums,
    height: canvas.height / setting.rowBlockNums
  }
  setting["aBlock"] = aBlock;
  return setting;
}
export default gameSetting;