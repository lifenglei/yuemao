// pages/chatroom/chatroom.js
//引入页面依赖的js
var api = require('../../requests/api.js');
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
//获取app实例以及定义所需数据
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatRoomList:[],
    scrollTop: 0,
    srollHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this= this;
    getMyChatRoom.call(_this)
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
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight
        });
      }
    })
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
  
  },
  goToChatRoom:function(e){
    var roomId = e.currentTarget.dataset.roomid;
    toChatRoom(roomId)

  }
})
//获取我管理的聊天室
function getMyChatRoom(){
  var _this = this;
  console.log(_this)
  var url = api.GET_MY_CHATROOM
  var data = {
    uid:'207370'
  }
  requests.getRequest(url, data).then(res => {
      if(res.data.dm_error==0){
        _this.setData({
          chatRoomList:res.data.data
        })
      }
  })
}
//进入聊天室
function toChatRoom(o){
  var url = api.COME_IN_CHATROOM;
  var data = {
    uid:app.globalData.userInfo.uid,
    room_id:o
  }
  requests.postRequest(url, data).then(res => {
    if(res.data.dm_error==0){
      app.globalData.roomInfo = res.data.room_info
      wx.navigateTo({
        url: `../chatin/chatin?roomid=${o}`,
      })
    }else{
      alert(res.data.error_msg)
    }
  })

}