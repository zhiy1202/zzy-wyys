// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    username:'',
    password:''
  },
  // 事件处理函数
  test(){
    wx.request({
      url: 'http://localhost:8080/allFood',
      success(data){
        console.log(data);
      }
    })
  },
  login(){
    // todo 登录是否成功 跳转list页面
    let that = this
    wx.request({
      url: 'http://localhost:8080/login',
      header:{
        'content-type':'application/x-www-form-urlencoded; charset=utf-8'
      },
      data:{
        username:that.data.username,
        password:that.data.password
      },
      method:'POST',
      success:function(data){
        console.log(data);
        if (data.data) {
          wx.setStorageSync('username', data.cookies[0])
          wx.navigateTo({
            url: '../list/list',
          })
        }else{
          wx.showToast({
            title: '用户不存在或密码错误',
            icon:'error',
            duration:2000
          })
        }
      }
    })
  },
  register(){
    let that = this
    wx.request({
      url: 'http://localhost:8080/register',
      method:'post',
      data:{
        username:that.data.username,
        password:that.data.password
      },
      success:function(data){
        if (data.data) {
          wx.showToast({
            title: '注册成功',
            icon:'success',
            duration:2000
          })
        }else{
          wx.showToast({
            title: '用户存在',
            icon:'error',
            duration:2000
          })
        }
      }
    })
    
  },
  onLoad() {
  },
})
