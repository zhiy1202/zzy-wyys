// pages/userLike/userLike.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userLikeList:[]
  },
  foodDetail(event){
    console.log(event);
    // todo 通过唯一id 前往详情页
    let foodId = event.target.dataset.foodid
    console.log(foodId);
    wx.navigateTo({
      url: '../detail/detail?foodId='+foodId
    })
  },
  delMes(event){
    //todo 删除记录
    let likeId = event.target.dataset.likeid
    let that = this

    wx.request({
      url: 'http://localhost:8080/delLike?likeId='+likeId,
      method:'DELETE',
      success:function(data){
        wx.showToast({
          title: data.data,
          icon:'success',
          duration:2000
        })

        let str = wx.getStorageSync('username')
        let arr = str.split('=')
        let username = arr[1].split(';')[0]

        wx.request({
          url: 'http://localhost:8080/getAllLike?username='+username,
          success:function(data){
            that.setData({
              userLikeList:data.data
            })
          }
        })
      }
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

    wx.request({
      url: 'http://localhost:8080/getAllLike?username='+username,
      success:function(data){
        console.log(data);
        that.setData({
          userLikeList:data.data
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