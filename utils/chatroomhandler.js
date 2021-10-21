
const Chatroom = require('../vendors/NIM_Web_Chatroom_v5.1.0.js');
let app = '';
export default class CHATEventHandler {
  constructor(headers) {
    app = headers.cpp;
    app.globalData.userInfo.room_id=app.globalData.roomInfo.room_id
    var cusTomRoom = {};
    cusTomRoom.user = app.globalData.userInfo
    app.globalData.chatroom = Chatroom.getInstance({
      // 初始化SDk
      debug: true,
      headers:headers,
      appKey: app.globalData.config.appkey,
      token: headers.token,
      account: headers.account,
      chatroomId:headers.chatroomid,
      chatroomAddresses:app.globalData.address,
      onconnect: this.onChatroomConnect,
      onerror: this.onChatroomError,
      onwillreconnect: this.onChatroomWillReconnect,
      ondisconnect: this.onChatroomDisconnect,
      // 消息
      onmsgs: this.onChatroomMsgs,
      chatroomCustom: JSON.stringify(cusTomRoom)
    })
  }
  /**
   * 连接成功
   */
  onChatroomConnect(obj){
    let self = this
    console.log('进入聊天室', obj);
    //读取队列
    app.globalData.chatroom.queueList({
      done(err, obj, content) {
        if (err) {
          console.error(err)
        }
        console.log(content)
        content.queueList.unshift({
          getList:'onchat'
        })
        self.headers.msgCallback(content.queueList);
        if (content && content.queueList) {
         var  queueCount = 0
          for (let i = 0; i < content.queueList.length; i++) {
            let queue = content.queueList[i]
            queueCount++

          }
        }
      }
    })
  }
  /**
   * s
   * SDK断开
   */
  onChatroomWillReconnect(obj) {
    // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
    console.log('即将重连', obj);
  }
  onChatroomDisconnect(error) {
    // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
    console.log('连接断开', error);
    if (error) {
      switch (error.code) {
        // 账号或者密码错误, 请跳转到登录页面并提示错误
        case 302:
          break;
        // 被踢, 请提示错误后跳转到登录页面
        case 'kicked':
          break;
        default:
          break;
      }
    }
  }
  onChatroomError(error, obj) {
    console.log('发生错误', error, obj);
  }
  onChatroomMsgs(msgs) {
    console.log('收到聊天室消息', msgs);
    let self = this
    //设置欢迎
    if (msgs[0].attach&&msgs[0].attach.type =='memberEnter'){
      self.headers.wellcomeCallback(msgs);
      //队列变化
    } else if (msgs[0].attach){
      msgs.forEach(msg => {
        if (msg.type === 'notification') {
          let attach = msg.attach
          let qc = attach.queueChange || {}
          switch (attach.type) {
            case 'updateQueue':
              if (qc.type === 'OFFER') {
                self.headers.msgCallback(qc);
              } else if (qc.type === 'POLL') {
                self.headers.msgCallback(qc);
              } else if (qc.type === 'DROP') {
                console.log(qc)
              } else if (qc.type === 'PARTCLEAR') {
                console.log(qc)
              }
              break
            case 'memberExit':
              self.headers.msgCallback(msg);
            break;
            case 'batchUpdateQueue':
              if (qc.type === 'PARTCLEAR'){
                self.headers.msgCallback(qc);
              }
          }
        }else if(msg.type=='text'){
              self.headers.messageListCallback(msg)
        }
      })
    }else{
      self.headers.messageListCallback(msgs)
    }
  }
}
function getChatroomDone(error, obj) {
  console.log('获取聊天室信息' + (!error ? '成功' : '失败'), error, obj);
}
