t// pages/chatin/chatin.js
import CHATEventHandler from '../../utils/chatroomhandler.js'
var api = require('../../requests/api.js');
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
var app = getApp();
let chatroomid =''
let that =''
let toMan = ''
let giftId =''
let originUid = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendType:1,
    up:true,
    uid:'',
    choseOrder:0,
    welnick:'',
    sendTonick:'麦序上所有用户',
    words:'',
    indicatorDots:true,
    duration: 1000,
    welcomeNick:false,
    focusFlag: false,//控制输入框失去焦点与否
    boss:'http://img2.inke.cn/MTUyNjYzOTMyMDI4NiM2OTEjanBn.jpg',
    origin: 'http://img2.inke.cn/MTUyNjYzOTMyMDI4NiM2OTEjanBn.jpg',
    ownNick:'',
    gift:false,
    gift_img:'',
    onChatMan:null,
    grids: [{
      nick: '',
      portrait: 'http://img2.inke.cn/MTUyNjYzOTMyMDI4NiM2OTEjanBn.jpg'
    },
    {
      nick: '',
      portrait: 'http://img2.inke.cn/MTUyNjYzOTMyMDI4NiM2OTEjanBn.jpg',
      uid:''
    },
    {
      nick: '',
      portrait: 'http://img2.inke.cn/MTUyNjYzOTMyMDI4NiM2OTEjanBn.jpg',
      uid: ''
    },
    {
      nick: '',
      portrait: 'http://img2.inke.cn/MTUyNjYzOTMyMDI4NiM2OTEjanBn.jpg',
      uid: ''
    },
    {
      nick: '',
      portrait: 'http://img2.inke.cn/MTUyNjYzOTMyMDI4NiM2OTEjanBn.jpg',
      uid: ''
    },
    {
      nick: '',
      portrait: 'http://img2.inke.cn/MTUyNjYzOTMyMDI4NiM2OTEjanBn.jpg',
      uid: ''
    },
    {
      nick: '',
      portrait: 'http://img2.inke.cn/MTUyNjYzOTMyMDI4NiM2OTEjanBn.jpg',
      uid: ''
    },
    {
      nick: '',
      portrait: 'http://img2.inke.cn/MTUyNjYzOTMyMDI4NiM2OTEjanBn.jpg',
      uid: ''
    }],
    messageList:[],
    inputValue: '',//文本框输入内容
    showModalStatus: false,
    firstGiftWall:[],
    sendondGiftWall:[],
    gold:'',
    modaltype:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.userInfo)
    that = this;
    chatroomid = options.roomid
    app.globalData.nim.getChatroomAddress({
      chatroomId: chatroomid,
      done: getChatroomAddressDone
    });
    getGiftWAll();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
    switchTab: function (e) {
      console.log(e)
      this.setData({
        choseOrder: e.currentTarget.dataset.index,
      });
      giftId = e.currentTarget.dataset.id;
    },
  showModal: function () {
    getOnChatMan()
    getOwnGoldLeave();
    var _this = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    _this.animation = animation
    animation.translateY(300).step()
    _this.setData({
      animationData: animation.export(),
      showModalStatus: true,
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.nim.getChatroomAddress({
      chatroomId: chatroomid,
      done: getChatroomAddressDone
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   
  },
  /**
 * 获取焦点
 */
  inputFocus(e) {
    this.setData({
      focusFlag: true
    })
  },
  /**
   * 失去焦点
   */
  inputBlur() {
    this.setData({
      focusFlag: false
    })
  },
  switchModal:function(){
    that.setData({
      modaltype:!that.data.modaltype
    })
  },
  /**
 * 输入事件
 */
  inputChange(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 发送文本
   */
  inputSend(e) {
    let text = e.detail.value
    console.log(text)
    sendChatMessage(text)
   
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    leaveRoom();
    
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
  sendGiftTOLike:function(){
    sendGiftMethods();
  },
  choseManSend:function(e){
      console.log(e)
      toMan = e.currentTarget.dataset.touid;
      that.setData({
        sendTonick: e.currentTarget.dataset.nick,
        modaltype:false
      })

  },
  //申请上麦
  applyChat:function(e){
    var number = e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content: '是否上麦？',
      success: function (res) {
        if (res.confirm) {
          requestChat(number,1);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //确认下麦
  offChat:function(){
    if(that.data.sendType==2){
      wx.showModal({
        title: '',
        content: '确定下麦吗',
        success: function (res) {
          if (res.confirm) {
              getOffChatMai()
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.showModal({
        title: '',
        content: '是否上麦？',
        success: function (res) {
          if (res.confirm) {
            requestChat(0, 1);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
   
  }
})
//链接聊天室 初始化
function connectChatroom(){
  new CHATEventHandler({
    cpp: app,
    account: wx.getStorageSync('uid'),
    token: wx.getStorageSync('ea_pass'),
    chatroomid: chatroomid,
    address: app.globalData.address,
    msgCallback(data){
      render(data);
    },
    wellcomeCallback(data){
      welcome(data)
    },
    messageListCallback(data){
      renderMessage(data)
    }
  })
}
//下麦
function getOffChatMai() {
  var url = api.GET_OFF_MAI;
  console.log(app.globalData)
  var data = {
    uid:app.globalData.userInfo.uid,
    room_id: app.globalData.roomInfo.room_id,
    type:1
  }
  requests.postRequest(url, data).then(res => {
    if(res.data.dm_error==0){
      wx.showToast({
        title: '下麦成功',
      })
      that.setData({
        sendtype:1
      })
    }
  })
}
//欢迎加入房间(欢迎一饮江河尽加入房间)
function welcome(data){
  console.log(data)
  if (data.length == 1 && data[0].attach.type =='memberEnter'){
    if (data[0].from != app.globalData.userInfo.uid) {
      var nick = data[0].fromCustom != '' && JSON.parse(data[0].fromCustom).user.nick;
      var noble_level = data[0].fromCustom != '' && JSON.parse(data[0].fromCustom).user.noble_level;
      var level = data[0].fromCustom != '' && JSON.parse(data[0].fromCustom).user.level;
      var text = (noble_level > 0 || level>1)?'驾到':'进入房间'
      that.setData({
        welcomeNick:true,
        n: level,
        welnick:`${nick}`,
        words:`${text}`
      })
      setTimeout(function(){
        that.setData({
          welcomeNick:false
        })
      },4000)
      console.log(JSON.parse(data[0].fromCustom).user.nick + '加入房间')
    } else {
      var nick = app.globalData.userInfo.nick;
      var text = (app.globalData.userInfo.noble_level > 0 || app.globalData.userInfo.level>3)?'驾到':'进入房间'
      that.setData({
        welcomeNick:true,
        n: app.globalData.userInfo.level,
        welnick: `${nick}`,
        words: `${text}`
      })
      setTimeout(function () {
        that.setData({
          welcomeNick: false
        })
      }, 4000)
    }
  }
  
}
//渲染麦上用户包括上麦 下麦和拉取列表
function render(data){
  if (data.attach && data.attach.type =='memberExit'){
    var info = JSON.parse(data.fromCustom);
    var n = {};
    n.text = '离开了房间'
    n.msg_type = 204;
    n.custom = info;
    that.data.messageList.push(n);
    that.setData({
      messageList: that.data.messageList
    })
  }
  if(Array.isArray(data)&&data[0].getList=='onchat'){
      //获取麦上的用户
      getAllManOnChat(data)
  }else{
    //麦序变化用户变化
    var leaveType = data.type;
    if (leaveType =='PARTCLEAR'){
      var leaveObj = data.elementKv;
      var order = ~~Object.keys(leaveObj)[0].replace(/[^0-9]/ig, "")
      var leaveInfo = JSON.parse(Object.values(leaveObj)[0]);
      showOnchat(order, leaveInfo, leaveType)
    }else{
      //上麦.下麦
      var info = JSON.parse(data.elementValue);
      var order = ~~info.mic_key.replace(/[^0-9]/ig, "");
      var changeType = data.type;
      //上麦OFFER下麦POLL 获取队列 
      showOnchat(order, info, changeType)
    }
  
  }
}
//获取聊天室服务器地址
function getChatroomAddressDone(error, obj) {
      app.globalData.address = obj.address
      connectChatroom()
}
//用于申请上麦包括置顶麦序和顺序麦
function requestChat(number,type){
  var url = api.APPLY_ON_CHAT;
  console.log(app.globalData)
  var data = {
    uid:app.globalData.userInfo.uid,
    room_id: app.globalData.chatroom.options.chatroomId,
    mic_key:number!=0?'mic_'+number:0,
    type:type
  }
  requests.postRequest(url, data).then(res=>{
    console.log(res)
    if(res.data.dm_error==0){
      console.log('上麦成功')
    }else{
      wx.showToast({
        title: '你已经在麦上了',
        icon: 'success',
        duration: 2000
      })  
    }
  })
}
//发送消息接口
function sendChatMessage(text){
  var url = api.SEND_CHATROOM_MESSAGE;
  var data={
      room_id:app.globalData.roomInfo.room_id,
      uid:app.globalData.userInfo.uid,
      content:text
  }
  requests.postRequest(url,data).then(res=>{
    console.log(res)
    if(res.data.dm_error==0){
      that.setData({
        messageList: that.data.messageList,
        inputValue:'',
        focusFlag:true
      })
    }
  })
}
//渲染消息列表
function renderMessage(data){
  console.log(data)
  var messageCustom=null;
  var o = {};
  if(Array.isArray(data)){
    messageCustom = JSON.parse(data[0].custom)
  }else{
    messageCustom = JSON.parse(data.custom)
  }
  renderMessageListBySend(o, messageCustom,data)
}
//麦序变化（上麦，下麦）
function showOnchat(order,info,changeType){
    if(changeType=='OFFER'){
      if (order == 100) {
        that.setData({
          boss: info.portrait,
          ownNick: info.nick,
          uid:info.uid,
          sendType: 2
        })
      } else {
        that.data.grids[order - 1] = {
          nick: info.nick,
          portrait: info.portrait,
          uid:info.uid
        }
        that.setData({
          grids: that.data.grids,
          sendType: 2
        })
      }
    }else if(changeType=='POLL'){
      if (order == 100) {
        that.setData({
          boss: that.data.origin,
          ownNick: '',
          uid:'',
          sendType: 1
        })
      } else {
        that.data.grids[order - 1] = {
          nick: '',
          uid:'',
          portrait: that.data.origin,
        }
        that.setData({
          grids: that.data.grids,
          sendType: 1
        })
      }
    }else{
      if (order == 100) {
        that.setData({
          boss: that.data.origin,
          ownNick: '',
          uid:'',
          sendType: 1
        })
      } else {
        that.data.grids[order - 1] = {
          nick: '',
          uid:'',
          portrait: that.data.origin,
        }
        that.setData({
          grids: that.data.grids,
          sendType: 1
        })
      }
      var n = {};
      n.text = '离开了房间'
      n.msg_type = 200;
      n.custom = info;
      that.data.messageList.push(n);
      that.setData({
        messageList: that.data.messageList
      })
      return;
    }
}
//获取麦上的用户
function getAllManOnChat(data){
  var list = data.splice(1);
  var onChatList = [];
  if (list.length == 0) {
    return;
  }
  for (var i in list) {
    for (var l in list[i]) {
      onChatList.push(JSON.parse(list[i][l]))
    }
  }
  onChatList.map(item => {
    item.mic_key = ~~item.mic_key.replace(/[^0-9]/ig, "")
  })
  //更改mic_100为100
  //判断是否含有主持麦位
  if (onChatList.length != 0) {
   var index =  onChatList.findIndex(function(value,index,arr){
      return value.mic_key==100
    })
   if(index!=-1){
     that.setData({
       boss: onChatList[index].portrait,
       ownNick: onChatList[index].nick,
       uid: onChatList[index].uid
     })
   }
   var arr = onChatList.filter(item => {
     return item.mic_key != 100
   })
   if (arr.length == 0) {
     that.setData({
       grids: that.data.grids
     })
   } else {
     arr.map(item => {
       that.data.grids[item.mic_key - 1] = {
         nick: item.nick,
         portrait: item.portrait,
         uid: item.uid
       }
     })
     that.setData({
       grids: that.data.grids
     })
     return;
   }
  }
}
//渲染消息列表通过后台接口
function renderMessageListBySend(o,msgType,data){
  if (msgType.msg_type == 102 || msgType.msg_type == 103){
    o.custom = msgType,
    o.text = data.text
    o.msg_type = msgType.msg_type
    that.data.messageList.push(o);
    that.setData({
      messageList: that.data.messageList
    })
  } else if (msgType.msg_type == 100){
    o.custom = msgType.users.sender;
    o.text = data[0].text;
    o.msg_type = msgType.msg_type
    that.data.messageList.push(o);
    that.setData({
      messageList: that.data.messageList
    })
  } else if (msgType.msg_type == 101){
    o.custom = msgType.users.sender;
    o.text = JSON.parse(data[0].text);
    o.msg_type = msgType.msg_type;
    that.data.messageList.push(o);
    that.setData({
      messageList: that.data.messageList,
      gift: true,
      gift_img: JSON.parse(data[0].text).gift_url
    })
    setTimeout(function(){
      that.setData({
        gift: false,
      })
    },5000)
  }
  console.log(that.data.messageList)
  var len = that.data.messageList.length;
  console.log(data)
  that.setData({
    view:`st-${len-1}`
  })
}
//聊天室礼物墙信息
function getGiftWAll(){
  var url = api.GIFT_WALL;
  var data={
    uid:app.globalData.userInfo.uid,
    from:4
  };
  requests.getRequest(url,data).then(res=>{
      console.log(res.data)
      if(res.data.dm_error==0){
        let beforeGiftList = res.data.gifts;
        let list1 = utils.pagiNation(1, 8, beforeGiftList);
        let list2 = utils.pagiNation(2, 8, beforeGiftList);
        console.log(app.globalData.userInfo)
        that.setData({
          firstGiftWall: list1,
          sendondGiftWall:list2
        })
      }
  })
}
//获取麦上用户列表除掉自己 设置uid
function getOnChatMan(){
  //选出主持的特殊位置
  var zhuchi = [{
    portrait: that.data.boss,
    nick: that.data.ownNick,
    uid:that.data.uid,
  }];
  //拼起来所有的麦上用户包括主持位置
    let allUsers = zhuchi.concat(that.data.grids)
  var deleteOwn = allUsers.filter(item=>{
    return item.uid!=app.globalData.userInfo.uid&&item.uid!=""
  })
  originUid = deleteOwn.map(item => {
    return item.uid
  }).join(',');
  let yueMao = [{
    portrait: 'http://img2.inke.cn/MTUyNzE0NTQyNjc5OSM0ODYjanBn.jpg',
    nick: '麦序上所有人',
    uid: originUid
  }].concat(deleteOwn)
  that.setData({
    onChatMan: yueMao
  })
  console.log(that.data.onChatMan)
}
//发送礼物给喜欢的用户
function sendGiftMethods(){
  var url = api.SEND_GIFT_TO_LIKE;
  var data={
    uid:app.globalData.userInfo.uid,
    to_uid: toMan || originUid,
    id: giftId || that.data.firstGiftWall[0].id || that.data.secondGiftWall[0].id,
    num:1,
    from:4,
    gift_type:0,
    room_id:app.globalData.roomInfo.room_id
  }
  requests.postRequest(url,data).then(res=>{
    console.log(res.data)
    if(res.data.dm_error==0){
      console.log('成功了')
      that.hideModal()
    }else{
      wx.showModal({
        title: '提示',
        content: '余额不足',
      })
    }
  })
}
//获取个人的钻石余额
function getOwnGoldLeave(){
  var url = api.PERSON_INFO;
  var data = {
    uid: app.globalData.userSid ? app.globalData.userSid.uid : '',
    sid: app.globalData.userSid ? app.globalData.userSid.sid : ''
  }
  requests.getRequest(url, data).then(res => {
    let result =res.data
    if (result.dm_error == 0) {
      app.globalData.userInfo.gold = (result.user_gold_account.gold / 100).toFixed(2)
      that.setData({
        gold: app.globalData.userInfo.gold
      })
    }
  })
}
//离开房间
function leaveRoom(){
  var url = api.LEAVE_ROOM;
  var data = {
    room_id:app.globalData.roomInfo.room_id,
    uid:app.globalData.userInfo.uid,
    type:0
  };
  requests.postRequest(url,data).then(res=>{
    console.log(res)
    if(res.data.dm_error==0){
      app.globalData.chatroom.ondisconnect()
    }
  })
}

