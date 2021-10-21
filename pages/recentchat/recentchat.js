import { calcTimeHeader, clickLogoJumpToCard } from '../../utils/imutil.js'
import { iconNoMessage } from '../../utils/imageBase64.js'
const NIM = require('../../vendors/NIM_Web_NIM_v5.1.0.js')
var api = require('../../requests/api.js');
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
var template = require('../../template/template.js');
import IMEventHandler from '../../utils/imeventhandler.js'
var app = getApp()
let startX = 0
let customObj =''
let receiveObj=''
let receiveInfo=''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconNoMessage: '',
    loginUserAccount: '',
    translateX: 0,
    defaultUserLogo: '/images/default-icon.png',
    accountUnreadMap: {}, // {'zys1': 1}
    chatList: [], // [{account,nick,lastestMsg,type,timestamp,displayTime,message,unread,status}]
    chatAccount: {} // {accountName: accountName} 备注:消息通知key为notification
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.chatList)
    template.tabbar("tabBar", 1, this)
    template.unreadNum(this)
    // 条目题目展示我的电脑
    this.setData({
      loginUserAccount: app.globalData.userSid.uid,
      iconNoMessage
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    let self = this
    wx.setNavigationBarTitle({
      title: '消息列表',
    })
    // 防止排序失败，再次排序
    for(let i=0; i<5; i++) {
      setTimeout(() => {
        self.sortChatList()
      }, i*1000)
    }
    setTimeout(() => {
      self.sortChatList()
      wx.hideLoading()
    }, 6*1000)
    if (Object.keys(app.globalData.recentChatList).length === 0) {
      this.setData({
        chatList: [],
        chatAccount: {}
      })
    } 
    // 删除指定条目
    app.globalData.subscriber.on('DELETE_RECENT_CHAT_ITEM', function (data) {
      // console.log(data)
      let chatList = [...self.data.chatList]
      let chatAccount = Object.assign({}, self.data.chatAccount)
      let deleteIndex = null
      chatList.map((item, index) => {
        if(item.account === data.account) {
          deleteIndex = index
          return
        }
      })
      if (deleteIndex || deleteIndex === 0) {
        chatList.splice(deleteIndex, 1)
        delete chatAccount[data.account]
        self.setData({
          chatAccount,
          chatList
        })
      }
    })
    // 监听删除所有通知消息（自己操作）
    app.globalData.subscriber.on('DELETE_All_NOTIFICATION', function () {
      let deleteIndex = 0
      if (self.data.chatAccount['notification']) {
        let temp = self.data.chatList
        delete self.data.chatAccount['notification']
        temp.map((item, index) => {
          if(item.account === '消息通知') {
            deleteIndex = index
            return
          }
        })
        temp.splice(deleteIndex, 1)
        self.setData({
          chatList: temp
        })
      }
    })
    //  监听系统消息（他人操作）
    app.globalData.subscriber.on('RECEIVE_SYSTEM_MESSAGE', function (msg) {
      // console.log(msg)
      self.addNotificationToChatList(msg)
    })
    app.globalData.subscriber.on('CLEAR_UNREAD_RECENTCHAT_UPDATESESSION', function ({ account }) {
    
      let chatList = [...self.data.chatList]
      chatList.map(item => {
        if (item.account === account) {
          item.unread = 0
        }
      })
      self.setData({
        chatList
      })
    })
    
    // 初始化时跟新未读数
    app.globalData.subscriber.on('UPDATE_RECENT_CHAT_UNREAD_ON_SESSION', function ({ account, unread }) {
      // console.log('UPDATE_RECENT_CHAT_UNREAD_ON_SESSION', account, unread)
      let accountUnreadMap = Object.assign(self.data.accountUnreadMap)
      accountUnreadMap[account] = unread
      self.setData({
        accountUnreadMap
      })
    })
    // 收到消息，刷新最近会话列表
    app.globalData.subscriber.on('UPDATE_RECENT_CHAT', self.updateRecentChat)
    app.globalData.subscriber.on('UPDATE_RECENT_CHAT_ON_MSG', self.updateRecentChat)
    app.globalData.subscriber.on('UPDATE_RECENT_CHAT_ON_SESSION', self.updateRecentChat)
    app.globalData.subscriber.on('UPDATE_RECENT_CHAT_ON_OFFLINE', self.updateRecentChat)
    // 转发消息，刷新最近会话列表
    app.globalData.subscriber.on('UPDATE_RECENT_CHAT_FORWARDCONTACT', self.updateRecentChat)    
  },
  /**
   * 显示时排序
   */
  onShow() {
    this.sortChatList()
    console.log(this.data.chatList)
  },
  /**
   * 排序chatlist
   */
  sortChatList() {
    if (this.data.chatList.length !== 0) {
      let chatList = [...this.data.chatList]
      chatList.sort((a, b) => {
        return parseInt(b.timestamp) - parseInt(a.timestamp)
      })

      //chatlist进行处理

      this.setData({
        chatList
      })
    }
  },
  /**
   * 更新最近会话列表
   * account, time, text, type, handler：标记已阅读离线消息，无需更新未读数
   * noUpdateUnreadFlag：不更新未读标志，用于己方发送消息
   */
  updateRecentChat({ account, time,custom, text, type, handler}, noUpdateUnreadFlag) {
    debugger
       customObj = JSON.parse(custom)
     if(account==customObj.users.sender.uid){
       receiveObj = customObj.users.sender
     }else{
       receiveObj = customObj.users.receive
     }
   
    let self = this
    let status = ''
    // 查找并更新在线状态
    for (let key in app.globalData.onlineList) {
      if (key === account) {
        status = app.globalData.onlineList[key]
      }
    }
    if (!self.data.chatAccount[account]) { // 最近会话列表中没有此人
      // 获取头像
      let avatar = receiveObj.portrait || self.data.defaultUserLogo
      let temp = {}
      let msg = text
      let unread = 1
      let nick = receiveObj.nick
      // 已阅读离线消息不更新
      switch (handler) {
        case 'onOfflineMsgs':
          unread = 0
          break
        case 'onSessions':
          unread = self.data.accountUnreadMap[account]
          break
        default:
          break
      }
      if (noUpdateUnreadFlag) { //己方发送消息，不更新未读数
        unread = 0
      }
      msg = self.judgeMessageType(type, customObj.msg_type)
      temp[account] = account
      self.setData({
        chatList: [{
          account,
          custom: customObj,
          nick,
          timestamp: time,
          displayTime: calcTimeHeader(time),
          lastestMsg: msg || text,
          type,
          unread,
          avatar
        }, ...self.data.chatList],
        chatAccount: Object.assign({}, self.data.chatAccount, temp)
      })
    } else { // 最近会话列表中有此人，更新会话
      let temp = [...self.data.chatList]
      temp.map((message, index) => {
        if (message.account === account) {
          let lastestMsg = ''
          let tempType = ''
          tempType = lastestMsg = self.judgeMessageType(type,customObj.msg_type)
          
          temp[index].lastestMsg = lastestMsg || text
          temp[index].type = tempType || type
          temp[index].timestamp = time
          temp[index].displayTime = calcTimeHeader(time)

          if (noUpdateUnreadFlag) { //己方发送消息，不更新未读数
            temp[index].unread = 0
          } else if (handler == 'onSessions') { //sessions过来的会话
          } else {
            if (temp[index].unread) {
              temp[index].unread += 1
            } else {
              temp[index].unread = 1
            }
          }
          return
        }
      })
      this.setData({
        chatList: temp
      })
    }

    // 排序
    this.sortChatList()


  },
  /**
   * 传递消息进来，添加至最近会话列表
   * 必须字段 {type, time, from,to}
   */
  addNotificationToChatList(msg) {
    let desc = ''
    let self = this
    switch (msg.type) {
      case 'addFriend': {
        desc = `添加好友-${msg.from}`
        break
      }
      case 'deleteFriend': {
        desc = `删除好友-${msg.from}`
        break
      }
      case 'deleteMsg':
        desc = `${msg.from}撤回了一条消息`
        break
      case 'custom':
        let data = JSON.parse(msg.content)
        let str = data['content'] || JSON.stringify(data) // 可能没有content属性
        desc = `自定义系统通知-${str}`
        break
      default: 
        desc = msg.type
        break
    }
    if (!self.data.chatAccount['notification']) { // 没有系统通知
      self.setData({
        chatList: [{
          account: '消息通知',
          timestamp: msg.time,
          displayTime: calcTimeHeader(msg.time),
          lastestMsg: desc,
        }, ...self.data.chatList],
        chatAccount: Object.assign({}, self.data.chatAccount, { notification: 'notification' })
      })
    } else {
      let temp = [...self.data.chatList]
      temp.map((message, index) => {
        if (message.account === '消息通知') {
          temp[index].lastestMsg = desc
          temp[index].timestamp = msg.time
          temp[index].displayTime = calcTimeHeader(msg.time)
          return
        }
      })
      temp.sort((a, b) => {
        return a.timestamp < b.timestamp
      })
      self.setData({
        chatList: temp
      })
    }
  },
  /**
   * 捕获从滑动删除传递来的事件
   */
  catchDeleteTap (e) {
    let account = e.currentTarget.dataset.data
    let chatAccount = Object.assign({}, this.data.chatAccount)
    delete chatAccount[account]
    let chatList = [...this.data.chatList]
    let deleteIndex = 0
    chatList.map((item, index) => {
      if(item.account === account) {
        deleteIndex = index
        return
      }
    })
    chatList.splice(deleteIndex, 1)
    this.setData({
      chatList,
      chatAccount
    })
  },
  /**
     * 单击消息通知 
     */
  switchToMessageNotification() {
    wx.navigateTo({
      url: '../../partials/messagenotification/messagenotification',
    })
  },
  /**
   * 单击进入聊天页面
   */
  switchToChating(e) {
    console.log(e.currentTarget.dataset.chatInfo)
    if (e.currentTarget.dataset.chatInfo.users.sender.uid==app.globalData.userInfo.uid){
      receiveInfo = e.currentTarget.dataset.chatInfo.users.receive
    }else{
      receiveInfo = e.currentTarget.dataset.chatInfo.users.sender
    }
    app.globalData.receiveObj = receiveInfo;
    console.log(app.globalData.receiveObj)
    let account = e.currentTarget.dataset.data
    let flag = false
    let chatList = [...this.data.chatList]

    // 告知服务器，标记会话已读
    app.globalData.nim.resetSessionUnread(`p2p-${account}`)

    chatList.map(item => {
      if(item.account === account) {
        if(item.unread) {
          item.unread = 0
          flag = true
        }
      }
    })
    if(flag) {
      this.setData({
        chatList
      })
    }
    
    wx.navigateTo({
      url: '../chating/chating?chatTo=' + account
    })
  },
  /**
   * 判断消息类型，返回提示
   */
  judgeMessageType(type,other) {
    let msg = ''
    if (type === 'image') {
      msg = '[图片]'
    } else if (type === 'text' && other==2){
      msg = '[礼物]'
    }
    return msg
  },
})

function connectIm() {
  new IMEventHandler({
    gpp: app,
    account: wx.getStorageSync('uid'),
    token: wx.getStorageSync('ea_pass')
  })
}

