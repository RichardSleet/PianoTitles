export default class block {
  constructor(x,y,width,height,color,gs,ctx){
    //block属性
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.gs = gs;
    this.ctx = ctx;
    //block状态
    this.status = '';
    //动画效果状态
    this.animationStatus = null;
    this.animationEnd = false;
    this.expandAnimation.bind(this);
    this.blinkAnimation.bind(this);
    Object.defineProperty(
      this,
      'y',
      {
        set: function(value) {
          if (gs.direction){
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
  //每帧都绘制自己
  drawMyself(){
    var {
          x, y, width, height, color
    } = this;
    var ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    ctx.fillRect(x, y, width, height);
    if (!this.animationEnd){
      //成功
      switch (this.status) {
        case 'success':
          this.expandAnimation(this.gs.successClickColor);
          break;
        case 'error':
          this.blinkAnimation(this.gs.errorClickColor);
          break;
        case 'forget':
          //this.expandAnimation(this.gs.forgetClickColor);
          break;
      }
    }
  }
  //扩大动画
  expandAnimation(color){
    var ctx = this.ctx;
    var gs = this.gs;
    //效果动画状态
    if (this.animationStatus == null){
      //设置一个子遮罩层
      this.animationStatus = {
        subRectX: this.x + gs.aBlock.width/4,
        subRectY: this.y + gs.aBlock.height/4,
        subRectWidth: gs.aBlock.width/2,
        subRectHeight: gs.aBlock.height/2
      }
    } else {
      if (this.animationStatus.subRectX >= this.x) {
        //状态动画还没有完成
        //控制子灰色Rect泛出的速率 -- 当前是平均速度
        ctx.fillStyle = color;
        ctx.fillRect(
          this.animationStatus.subRectX,
          this.animationStatus.subRectY,
          this.width,
          this.height
        )
        var distancePerFrameX = this.animationStatussubRectWidth/160; 
        var distancePerFrameY = this.animationStatussubRectHeight/160;
        this.animationStatus.subRectX -= distancePerFrameX;
        // 这里需要获得下落速度
        this.animationStatus.subRectY -= (distancePerFrameY + 5);
        this.animationStatus.subRectWidth += distancePerFrameX * 2;
        this.animationStatus.subRectHeight += distancePerFrameY * 2;
        } else {
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
    var ctx = this.ctx;
    var gs = this.gs;
    if (this.animationStatus == null) {
      //设置一个子遮罩层
      this.animationStatus = {
        isShow: -10,
        showColor: gs.errorClickColor,
      }
    } else {
      if (this.animationStatus.isShow <= 0) {
        ctx.fillStyle = this.animationStatus.showColor;
        ctx.fillRect(
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