// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commonIsShow:false,
    foodId:0,
    food:{},
    commonList:[],
    foodInfo:{},
    common:''
  },
  addComm(){
    let str = wx.getStorageSync('username')
    let arr = str.split('=')
    let username = arr[1].split(';')[0]
    let that = this
    wx.request({
      url: 'http://localhost:8080/addComm',
      method:'POST',
      data:{
        foodId:that.data.food._id,
        username:username,
        content:that.data.common,
        createTime:new Date()
      },
      success:function(data){
        console.log(data);
        if (data.data) {
          wx.request({
            url: 'http://localhost:8080/getFoodComm?foodId='+that.data.food._id,
            success:function(data){
              console.log(data);
              that.setData({commonList:data.data})
            }
          })
        }
      }
    })
  },
  downComm(){
    this.setData({commonIsShow:false})
  },
  showCommon(){
    // todo 发起请求获取评论
    this.setData({commonIsShow:true})
    let that = this
    wx.request({
      url: 'http://localhost:8080/getFoodComm?foodId='+that.data.food._id,
      success:function(data){
        console.log(data);
        that.setData({commonList:data.data})
      }
    })
  },
  addLike(){
    //发起请求添加喜欢
    let that = this
    wx.request({
      url: 'http://localhost:8080/changeLike?foodInfoId='+that.data.food._id,
      method:'put',
      success:function(data){
        console.log(data);
        if (data.data) {
            wx.showToast({
              title: '点赞成功',
              icon:'success',
              duration:2000
            })
            //更新点赞数量
            wx.request({
              url: 'http://localhost:8080/foodInfo?foodInfoId='+that.data.food._id,
              success:function(data){
                that.setData({foodInfo:data.data})
              }
            })
            //用户添加喜欢列表
            let str = wx.getStorageSync('username')
            let arr = str.split('=')
            let username = arr[1].split(';')[0]
            wx.request({
              url: 'http://localhost:8080/addLike',
              header:{
                'content-type':'application/x-www-form-urlencoded; charset=utf-8'
              },
              method:'POST',
              data:{
                username:username,
                foodId:that.data.food._id,
                foodName:that.data.food.name,
                createTime:new Date()
              },
              success:function(data){
                console.log(data);
                console.log('用户喜欢添加');
              }
            })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let foodId = options.foodId
    let that = this
    let str = wx.getStorageSync('username')
    let arr = str.split('=')
    let username = arr[1].split(';')[0]

    wx.request({
      url: 'http://localhost:8080/getFoodById?foodId='+foodId,
      success:function(data){
        that.setData({food:data.data})
        //发起用户浏览记录添加
        wx.request({
          url: 'http://localhost:8080/addHistory',
          method:'post',
          data:{
            username:username,
            foodId:foodId,
            foodName:that.data.food.name,
            createTime:new Date()
          }
        })
      }
    })
    wx.request({
      url: 'http://localhost:8080/foodInfo?foodInfoId='+foodId,
      success:function(data){
        that.setData({foodInfo:data.data})
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})