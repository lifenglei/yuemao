//index.js
//获取应用实例
var app = getApp()
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
var api = require('../../requests/api.js');
var template = require('../../template/template.js');
import IMEventHandler from '../../utils/imeventhandler.js'
Page({
  data: {
    duration: 1000,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    plain: false,
    scrollTop:0,
    girlList:[],
    arr:[],
    src:'',
    srollHeight:0,
    banner:[]
  },
  //事件处理函数
  onLoad () {
    template.tabbar("tabBar", 0, this)
    template.unreadNum(this)
    getTopBanner.call(this)
    requestYuemaoData.call(this);
    connectIm()
  },
  onUnload(){

  },
  onHide(){
    
  },
  //页面显示获取设备屏幕高度，以适配scroll-view组件高度
  onShow:function(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: res.windowHeight
        });
      }
    })
    if (app.globalData.zhubo!=null){
      app.globalData.zhubo={}
    }
    console.log(app.globalData)
  },
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function () {
    // return {
    //   title: '月猫约玩微信小程序',
    //   desc: '主播最多的交友平台!',
    //   path: '/page/index'
    // }
  }
})
/**
 * 
 * 获取大厅月猫列表
 */
function requestYuemaoData(){
  var url = api.API_GET_YUEMAO;
  var params = {
    cv: 'weixin_app',
    uid:'207370'
  };
  requests.getRequest(url,params).then(res=>{
    if (res.data.dm_error == 0){
      let girlList = [];
      this.setData({
        girlList: res.data.users.map(item => {
          return item.profile
        })
      }) 
    }
  }).catch(error => {
    console.log(error)
  })
}
/**
 * 
 * 获取banner列表
 */
function getTopBanner(){
  var _this = this;
  var url = api.API_GET_BANNER;
  var data = {
    tab_id:1004
  }
  requests.getRequest(url,data).then(res=>{
    if(res.data.dm_error==0){
      _this.setData({
        banner:res.data.data
      })
      if(res.data.data.length==1){
        _this.setData({
          indicatorDots:false
        })
      }
    }
  })
}

function connectIm() {
  new IMEventHandler({
    gpp: app,
    account: wx.getStorageSync('uid'),
    token: wx.getStorageSync('ea_pass')
  })
}