// components/myTabBar/MyTabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goHome(){
      wx.navigateTo({
        url: '../../pages/home/home',
      })
    },
    goFoodList(){
      wx.redirectTo({
        url: '../../pages/list/list'
      })
    }
  }
})
