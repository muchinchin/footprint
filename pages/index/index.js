//index.js
Page({
  data: {
  },

  onLoad: function () {

  },

  goToProvince: function () {
    wx.navigateTo({
      url: '../province/index',
    })
  },

  /**
  * 分享
  */
  onShareAppMessage: function () {
    return {
      title: '你都去过哪些城市？',
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

})
