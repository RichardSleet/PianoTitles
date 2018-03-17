/**
 * Block块实例
 */
export default class block {
  /**
   * x: 显示横轴坐标
   * y: 显示纵轴坐标
   * width: 宽度
   * height: 高度
   * color: 显示颜色
   */
  constructor(x, y, width, height, color){
    //block属性
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    //block状态
    this.status = '';
    //动画效果状态
    this.animationStatus = null;
    this.animationEnd = false;
    this.expandAnimation.bind(this);
    this.blinkAnimation.bind(this);
    //拦截器
    Object.defineProperty(
      this,
      'y',
      {
        set: function(value) {
          if (wx.PTConfig.direction){
            y -= value;
          } else {
            y += value;
          }
        },
        get : function() {
          return y
        }
      }
    )
  }
  //实例绘制线程
  drawMyself(){
    var {
        x, y, width, height, color
    } = this;
    wx.PTContext.fillStyle = color;
    wx.PTContext.lineWidth = 1;
    wx.PTContext.strokeRect(x, y, width, height);
    wx.PTContext.fillRect(x, y, width, height);
    if (!this.animationEnd){
      //成功
      switch (this.status) {
        case 'success':
          //点击效果扩大动画
          this.expandAnimation(wx.PTConfig.successClickColor);
          break;
        case 'error':
          this.blinkAnimation(wx.PTConfig.errorClickColor);
          break;
        case 'forget':
          this.expandAnimation(wx.PTConfig.forgetClickColor);
          break;
      }
    }
  }
  //
  expandAnimation(color){
    //效果动画状态
    if (this.animationStatus == null){
      //设置一个子遮罩层
      this.animationStatus = {
        subRectX: this.x + wx.PTConfig.aBlock.width/4,
        subRectY: this.y + wx.PTConfig.aBlock.height/4,
        subRectWidth: wx.PTConfig.aBlock.width/2,
        subRectHeight: wx.PTConfig.aBlock.height/2
      }
    } else {
      if (this.animationStatus.subRectX >= this.x) {
        //状态动画还没有完成
        //控制子灰色Rect泛出的速率 -- 当前是平均速度
        wx.PTContext.fillStyle = color;
        wx.PTContext.fillRect(
          this.animationStatus.subRectX,
          this.animationStatus.subRectY,
          this.width,
          this.height
        )
        var distancePerFrameX = this.animationStatussubRectWidth / 160; 
        var distancePerFrameY = this.animationStatussubRectHeight / 160;
        this.animationStatus.subRectX -= distancePerFrameX;
        // 这里需要获得下落速度
        this.animationStatus.subRectY -= (distancePerFrameY + 5);
        this.animationStatus.subRectWidth += distancePerFrameX * 2;
        this.animationStatus.subRectHeight += distancePerFrameY * 2;
        } else {
          //动画结束
          this.animationStatus.subRectX = this.x;
          this.animationStatus.subRectY = this.y;
          this.animationStatus.subRectWidth = this.width;
          this.animationStatus.subRectHeight = this.height;
          this.color = color;
          this.animationEnd = true;
        }
      }
    }
  //闪烁动画
  blinkAnimation(){
    if (this.animationStatus == null) {
      //设置一个子遮罩层
      this.animationStatus = {
        isShow: -10,
        showColor: wx.PTConfig.errorClickColor,
      }
    } else {
      if (this.animationStatus.isShow <= 0) {
        wx.PTContext.fillStyle = this.animationStatus.showColor;
        wx.PTContext.fillRect(
          this.x,
          this.y,
          this.width,
          this.height
        )
        this.animationStatus.isShow++;
      } else if (this.animationStatus.isShow === 10) {
        this.animationStatus.isShow = -10;
      } else {
        this.animationStatus.isShow++;
      }
    }
  }
  
  //点击成功
  clickSuccess(){
    this.status = 'success'
  }
  //点击失败
  clickError(){
    this.status = 'error'
  }
  //忘记点中
  forgetClick(){
    this.stats = 'forget'
  }
}