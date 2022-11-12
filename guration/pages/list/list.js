// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodList:[],
    foodName:''
  },
  foodDetail(event){
    // todo 获取唯一id 进入detail页面展示
    wx.navigateTo({
      url: '../detail/detail?foodId='+event.currentTarget.dataset.foodid,
    })
  },
  searchFood(){
    let that = this
    wx.request({
      url: 'http://localhost:8080/getFoodsByName?foodName='+that.data.foodName,
      success:function(data){
        that.setData({foodList:data.data})
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this

    let str = wx.getStorageSync('username')
    let arr = str.split('=')
    let username = arr[1].split(';')[0]
    
    wx.request({
      url: 'http://localhost:8080/getUserByName?username='+username,
      success:function(data) {
        console.log(data);
        let bmi = data.data.bmi
        console.log(bmi);
        if (bmi) {
          wx.request({
            url: 'http://localhost:8080/getGoodFood?bmi='+bmi,
            success:function(data){
              that.setData({foodList:data.data})
            }
          })
        }else{
          wx.request({
            url: 'http://localhost:8080/allFood',
            success:function(data){
              that.setData({foodList:data.data})
            }
          })
        }
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