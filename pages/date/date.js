// pages/date/date.js
var app = getApp();
var api = require('../../requests/api.js');
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
var query = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:null,
    code:null,
    user_type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
  this.setData({
    user_type:options.user_type
  })
    query = options;
    getOrderDetailInfo.call(this)
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
  copyQq:function(){
    var _this = this;
    var dataT = "";
    dataT = _this.data.result.user_info.qq;
    wx.setClipboardData({
      data: dataT,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            utils.alertView('提示','复制成功',function(){
              console.log('inke')
            })
          }
        })
      }
    })
  },
  orderDone(){
    var _this = this;
    wx.showModal({
      title: '完成订单',
      content: '确认之后，订单将结束，主播会收到这次的服务金额。',
      confirmText: '确认',
      showCancel: true,
      success:function(res){
        if(res.confirm){
          orderDone.call(_this)
        }else{

        }
      },

    })  
  }
})

/**
 * 
 * 获取订单详情
 */
function getOrderDetailInfo(){
  var _this = this;
  console.log(query)


  var url = api.GET_ORDER_DETAIL;
  utils.showLoading('正在加载')
  requests.getRequest(url,query).then(res=>{
    console.log(res.data.order_info.user_info)
    if(res.data.dm_error==0){
      _this.setData({
        result: res.data.order_info,
        code: res.data.order_info.order_status
      })
      utils.hideToast()
    }
    
  }).catch(error=>{
    console.log(error)
  })
}

/**
 * 
 * 完成订单
 * uid
 * to_uid
 * order_id
 * status=4
 */
function orderDone(){
  var _this = this;
  var url = api.FINISH_ORDER;
  var item = _this.data.result
  var data = {
    uid: item.uid,
    to_uid: item.to_uid,
    order_id: item.order_id,
    status:4,
    sid: app.globalData.userSid.sid
  }
  requests.postRequest(url,data).then(res=>{
    if(res.data.dm_error==0){
      _this.setData({
        user_type:1
      })
    }else if(res.data.dm_error==604){
      app.checkSid()
    }
  })
}