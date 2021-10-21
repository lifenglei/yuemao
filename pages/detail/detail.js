//引入页面依赖的js
var api = require('../../requests/api.js');
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
//获取app实例以及定义所需数据
var app = getApp();
let data_id = '';
let projectPrice = '';
let projectNum = '';
let skill_id = '';
let service_id = '';
let orderNumber = '';
let to_uid = '';
let order_id = '';
let ser = '';
let xx = "";
let d = {
  /**
   * 页面的初始数据
   */
  data: {
    duration: 500,
    qq: '',
    swiperIndex: 0,
    hide: false,
    commentshow: true,
    circular: true,
    indicatorDots: true,
    videoStatus: true,
    auto: false,
    needMoney: '',
    dotsColor: 'white',
    num: [1, 2, 5, 10, 520],
    numItem: 0,
    color: 'bule',
    showModalStatus: false,
    autoplay: false,
    showSwiper: false,
    interval: 1000,
    detailList: [],
    Hei: "",
    res: null,
    uid: '',
    userUid: '',
    nick: '',//昵称
    isIpx: app.globalData.isIphonex.indexOf("iPhone X") != -1 ? true : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let _this = this;
    utils.showLoading('正在加载图片')
    //设置图片全屏
    var winHeight = wx.getSystemInfoSync().windowHeight;
    _this.setData({
      Hei: winHeight + 'px'//设置高度
    })
    //设置页面navbarText
    data_id = options.uid;
    _this.setData({
      uid: data_id,
      userUid: app.globalData.userSid ? app.globalData.userSid.uid : ''
    })
    //获取月猫详情
    getDetail.call(_this);
  },
  //下单底部弹窗
  showModal: function () {
    var _this = this;
    // 显示遮罩层初始化四个参数

    projectPrice = '';
    projectNum = '';
    skill_id = '';
    service_id = '';
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    _this.animation = animation
    animation.translateY(300).step()
    //获取才艺价值
    let price = ser[0].price / 100;
    _this.setData({
      animationData: animation.export(),
      showModalStatus: true,
      currentTopItem: "0",
      numItem: "0",
      needMoney: price
    })
    setTimeout(function () {
      animation.translateY(0).step()
      _this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var _this = this;
    var animation = wx.createAnimation({
      duration: 50,
      timingFunction: "linear",
      delay: 0
    })
    _this.animation = animation
    animation.translateY(300).step()
    _this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      _this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 50)
  },
  //切换才艺(数量默认为1)
  switchTab: function (e) {
    let orderObj = e.currentTarget.dataset.obj;
    skill_id = orderObj.skill_id;
    service_id = orderObj.service_id;
    projectPrice = orderObj.price
    to_uid = orderObj.uid;
    this.setData({
      currentTopItem: e.currentTarget.dataset.index,
      needMoney: projectPrice * (projectNum || 1) / 100
    });
  },
  flow: function () {
    this.hideModal()
    wx.navigateTo({
      url: '../flow/flow'
    })
  },
  //切换数量
  switchNum: function (e) {
    projectNum = e.currentTarget.dataset.count
    this.setData({
      numItem: e.currentTarget.dataset.index,
      needMoney: (projectPrice || ser[0].price) * projectNum / 100
    });
  },
  qqInput: function (e) {
    this.setData({
      qq: e.detail.value
    })
  },
  sureOrder: function () {
    var _this = this;
    var qqReg = /^[1-9]\d{4,10}$/;
    if (_this.data.qq == '') {
      utils.alertView("提示", "请输入qq号码", function () {

      });
      return;
    }
    if (qqReg.test(_this.data.qq) == false) {
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
    //检查sid是否过期
    xx = _this;
    getOrder.call(_this)
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
    wx.setStorageSync('video', 'false');
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollHeight: this.data.isIpx ? (res.windowHeight - 10) : res.windowHeight,
          qq: app.globalData.userInfo && app.globalData.userInfo.qq,
          currentTopItem: -1,
          numItem: -1
        });
        console.log(this.data.scrollHeight)
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
  changeSwiper() {
    this.setData({
      swiperIndex: '1'
    })
  },
  getWechat() {
    var account = data_id;
    app.globalData.receiveObj={};
    wx.navigateTo({
      url: `../chating/chating?chatTo=${account}`
    })
  },
  //展示视频
  showVideo() {
    //关联播放器
    this.videoContext = wx.createVideoContext('myAudio');
    //显示播放
    this.setData({
      videoStatus: false,
      showSwiper: true
    })
  },
  //结束视频
  endVideo() {
    // this.setData({
    //   videoStatus: true,
    //   showSwiper: false
    // })
  },
  //播放视频
  playing: function () {
    this.setData({
      showSwiper: true
    })
  },
  //暂停视频
  pauseing: function () {
    if (wx.getStorageSync('video') == 'true') {
      this.setData({
        showSwiper: true
      })
    }

  },
  //缓冲视频
  waitting: function () {
    if (wx.getStorageSync('video') == 'true') {
      this.setData({
        showSwiper: true
      })
    }
  }
};

Page(d);
/**
 * 获取个人详情信息
 */
function getDetail() {
  var _this = this;
  var url = api.API_GET_DETAIL;
  var data = {
    id: data_id,
    uid: app.globalData.userSid ? app.globalData.userSid.uid : ''
  }
  requests.getRequest(url, data).then(res => {
    var result = res.data
    ser = result.services;
    var arr = result.user_comment_list && result.user_comment_list.data;
    _this.setData({
      detailList: result.profile.photo_list,
      res: result,
      nick: result.profile.nick
    })
    wx.setNavigationBarTitle({ title: _this.data.nick });
    //把主播的信息存到全局
    console.log(result)
    app.globalData.zhubo = {
      uid: result.profile.uid,
      nick: result.profile.nick,
      portrait: result.profile.portrait

    }
    console.log(app.globalData)
    //无评价
    if (!_this.data.res.hasOwnProperty('user_comment_list')) {
      _this.setData({
        commentshow: false
      })
    }
    //无认证
    if (!_this.data.res.profile.hasOwnProperty('addv_icon')) {
      _this.setData({
        hide: 'hide'
      })
    }
    utils.hideToast();
    for (var i = 0; i < arr.length; i++) {
      arr[i].ctime = utils.getDateDiff(utils.getDateTimeStamp(arr[i].ctime))
    }
  })
}
//创建订单
function getOrder() {
  var _this = xx;
  var app = getApp()
  if (app.globalData.userSid && app.globalData.userSid.sid != '') {
    utils.showLoading('正在支付...')
  }
  var url = api.GET_ORDER;
  //?为何取到是个错误的
  var data = {
    uid: app.globalData.userSid.uid,
    sid: app.globalData.userSid.sid,
    to_uid: data_id,
    skill_id: skill_id || ser[0].skill_id,
    service_id: service_id || ser[0].service_id,
    price: projectPrice || ser[0].price,
    num: projectNum || 1,
    order_type: 0,
    qq: _this.data.qq
  }
  requests.postRequest(url, data).then(res => {
    order_id = res.data.order_id
    if (res.data.dm_error == 0) {
      payMent(res.data, _this)
    } else if (res.data.dm_error == 604) {
      //checkSid();
      app.getUserInfo(xx, getOrder);
    } else if (res.data.dm_error == -99) {
      utils.hideToast()
      wx.showModal({
        title: '提示',
        content: '视频体验服务每人只能享受一次哦',
        success: function () {
          _this.hideModal()
        }
      })
    } else if (res.data.dm_error == -1) {
      wx.redirectTo({
        url: '../charge/charge?uid=' + app.globalData.userSid.uid + '&sid=' + app.globalData.userSid.sid
      })
    }
  }).catch(error => {
    console.log(error)
  })
}
//创建支付 唤起微信接口
function payMent(res, _this) {
  utils.hideToast()
  var url = api.PAY_MONEY;
  var data = {
    uid: res.uid,
    sid: app.globalData.userSid.sid,
    manner: "weixin_app",
    cc: 'TG001',
    client: 4,
    shan_order_id: res.order_id,
    openid: wx.getStorageSync('openid')
  }
  requests.postRequest(url, data).then(res => {
    //传递支付数据
    if (res.data.dm_error == 0) {
      wx.requestPayment(
        {
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': 'MD5',
          'paySign': res.data.data.paySign,
          'success': function (response) {
            //跳转到约会详情页面
            wx.navigateTo({
              url: '../date/date?user_type=0&uid=' + app.globalData.userSid.uid + '&order_id=' + order_id
            })
          },
          'fail': function (response) {
            _this.hideModal()
          },
          'complete': function (response) {
            _this.hideModal()
          }
        })
    }
  })
}
