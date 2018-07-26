//app.js
var api = require('utils/api.js')

App({
  onLaunch: function () {

  },

  // 获取微信授权凭证
  getWXAuthor: function (callback) {
    var that = this;
    if (that.globalData.userId) {
      typeof callback == "function" && callback(true);
    } else {
      //调用登录接口
      wx.login({
        success: function (e) {
          that.globalData.code = e.code;
          wx.setStorage({
            key: "code",
            data: e.code,
          })
          let param = {
            'code': e.code
          };

          api.connectWX(param, function (res) {
            console.log(res);
            if (res.code == '1') {
              if(res.data.id != '0'){
                that.globalData.userId = res.data.id;
                wx.setStorage({
                  key: "userId",
                  data: res.data.id,
                })
                typeof callback == "function" && callback(true);
              }
            }
            typeof callback == "function" && callback(false);
          });
        }
      });
    }
  },

  getUserId: function (callback) {
    var userId = wx.getStorageSync('userId');
    if (userId != '') {
      this.globalData.userId = userId;
      typeof callback == "function" && callback(true);
    }
    else{
      // 未登录
      // this.getWXAuthor();
    }
  },

  globalData: {
    userId: null
  }
})