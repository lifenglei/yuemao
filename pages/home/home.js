var app = getApp();
var api = require('../../requests/api.js');
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
var template = require('../../template/template.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    nick: '',
    is_ka: '',
    age: '',
    gender: '',
    uid: '',
    user_account: '',
    version: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      version: utils.getCv().replace(/[^\d.]/g, '')
    })
    template.tabbar("tabBar", 2, _this)
    template.unreadNum(_this)
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
    getPersonInfo.call(this)
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

  downApp() {
    wx.showModal({
      title: '提示',
      content: '下载月猫APP  与主播直接沟通\n(各大商店均有上架)',
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#f3519e',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  getMoneyOut() {
    wx.showModal({
      title: '提示',
      content: '微信搜索关注“月猫APP”公众号提现',
      confirmText: '确定',
      showCancel: false,
      success: function () {
      }
    })

  },
  getuserinfo(data) {
    console.log(data)
  },
  goEditor: function () {
    wx.navigateTo({
      url: '../editor/editor'
    })
  },
  goToChatroom:function(){
    wx.navigateTo({
      url: '../chatroom/chatroom',
    })
  }
})




function getPersonInfo() {
  var _this = this;
  var url = api.PERSON_INFO;
  var data = {
    uid: app.globalData.userSid ? app.globalData.userSid.uid : '',
    sid: app.globalData.userSid ? app.globalData.userSid.sid : ''
  }
  requests.getRequest(url, data).then(res => {
    var result = res.data;
    if (result.dm_error == 0) {
      console.log(result)
      _this.setData({
        avatar: result.profile.portrait,
        nick: result.profile.nick,
        age: result.profile.age,
        gender: result.profile.gender,
        is_ka: result.is_ka,
        uid: result.profile.uid,
      })
      console.log(app.globalData.UserInfo)
      console.log((result.user_gold_account.gold / 100).toFixed(2))
    
      console.log(app.globalData.userInfo)

      if (result.is_ka == 1) {
        _this.setData({
          user_account: result.user_account
        })
      }
    } else if (result.dm_error == 604) {
      app.checkSid()
    }

  }).catch(error => {
    console.log(error)
  })
} 