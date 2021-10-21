// pages/editor/info.js
var app = getApp();
var api = require('../../requests/api.js');
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
var newInfo = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeType: '',
    status: false,
    qq:'',
    nick:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id == 1) {
      this.setData({
        changeType: 1,
        nick: app.globalData.userInfo.nick
      })
      wx.setNavigationBarTitle({
        title: '修改昵称'
      })
    } else {
      this.setData({
        changeType: 2,
        qq: app.globalData.userInfo.qq
      })
      wx.setNavigationBarTitle({
        title: '修改QQ号'
      })
    }
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
    newInfo = ''
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
  changeInfo() {
    changePersonInfo.call(this)
  },
  qqInput: function (e) {
    //获取输入的内容
    newInfo = e.detail.value;
  },
})
function changePersonInfo() {
  console.log(this.data.changeType)
  var qqReg = /^[1-9]\d{4,10}$/;
  var url = api.CHANGE_INFO;
  var query = {
    uid: app.globalData.userSid.uid,
    sid: app.globalData.userSid.sid,
    nick: '',
    qq: ''
  }
  if (this.data.changeType == 1) {
    query.nick = newInfo;
    query.qq = app.globalData.userInfo.qq
    if(newInfo==''){
      wx.showModal({
        title: '提示',
        content: '输入不能为空',
        confirmText: '确定',
        showCancel: false,
        success: function () {

        }
      })
      return
    }
  } else if (this.data.changeType == 2) {
    query.qq = newInfo;
    query.nick = app.globalData.userInfo.nick
    if(newInfo==''){
      wx.showModal({
        title: '提示',
        content: '输入不能为空',
        confirmText: '确定',
        showCancel: false,
        success: function () {

        }
      })
      return

    }else{
      if (qqReg.test(query.qq) == false) {
        wx.showModal({
          title: '提示',
          content: '请输入正确的qq号',
          confirmText: '确定',
          showCancel: false,
          success: function () {

          }
        })
        return
      }
    }
   
  }

  utils.showLoading('正在提交...')
  requests.postRequest(url, query).then(res => {
    console.log(res.data)
    if (res.data.dm_error == 0) {
      utils.hideToast()
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 2000
      })
      if (this.data.changeType == 1) {
        console.log(newInfo)
        app.globalData.userInfo.nick = newInfo
      } else {
        app.globalData.userInfo.qq = newInfo
      }
      this.setData({
        status: true
      })
      setTimeout(() => {
        this.setData({
          status: false
        })
      }, 5000)
    }
  })
}