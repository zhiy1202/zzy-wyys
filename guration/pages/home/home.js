// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    BIMIsShow:false,
    userSelf:{},
    userHeight:0,
    userWeight:0
  },
  changeUserInfo(){
    this.setData({
      BIMIsShow:true
    })
  },
  downBMI(){
    let str = wx.getStorageSync('username')
    let arr = str.split('=')
    let username = arr[1].split(';')[0]

    let height = this.data.userHeight
    let weight = this.data.userWeight

    let that = this
    wx.request({
      url: `http://localhost:8080/changeBMI`,
      method:'PUT',
      data:{
        username:username,
        height:height,
        weight:weight
      },
      success:function(data){
        if (data.data) {
          that.setData({
            BIMIsShow:false
          })
          wx.showToast({
            title: '更新bmi值成功',
            icon:'success',
            duration:2000
          })
        }
      }
    })
    
  },
  userLike(){
    wx.navigateTo({
      url: '../userLike/userLike',
    })
  },
  userHistory(){
    wx.navigateTo({
      url: '../userHistory/userHistory',
    })
  },
  addIdea(){
    console.log(11);
  },
  exit(){
    wx.redirectTo({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let str = wx.getStorageSync('username')
    let arr = str.split('=')
    let username = arr[1].split(';')[0]

    let that = this
    //获得用户的信息
    wx.request({
      url: 'http://localhost:8080/getUserByName?username='+username,
      success:function(data){
        console.log(data);
        that.setData({
          userSelf:data.data
        })
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