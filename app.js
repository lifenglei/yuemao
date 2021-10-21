//app.js
var utils = require('./utils/util.js');
var requests = require('./requests/request.js');
var api = require('./requests/api.js');
var config = require('./utils/config.js');
var subscriber = require('./utils/event.js');
import IMEventHandler from './utils/imeventhandler.js'
App({
    onLaunch: function() {
        // 展示本地存储能力
        let that = this;
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        wx.getSystemInfo({
            success: function(res) {
                that.globalData.isIphonex = res.model
            }
        })
    },
    //事件处理函数
    onShow: function() {

    },
    //登录流程
    getUserInfo: function(result, callback) {
        var _this = this;
        var unionid = (wx.getStorageSync('unionid'))
        var openid = (wx.getStorageSync('openid'))
        if (unionid) {
            //判断用户是否登录过小程序
            wx.request({
                url: 'https://shanshanapi.inke.cn/api/skill/wechat/get_user_info',
                data: {
                    union_id: unionid,
                    open_id: openid,
                    cv: utils.getCv()
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                success: function(res) {
                    if (res.data.dm_error == 0) {
                        _this.globalData.userInfo = res.data.data.profile;
                        //生成发送者信息
                        _this.globalData.senderInfo = {
                            uid: res.data.data.profile.uid,
                            nick: res.data.data.profile.nick,
                            portrait: res.data.data.profile.portrait,
                            level: res.data.data.profile.level,
                            gender: res.data.data.profile.gender,
                            noble_level: res.data.data.profile.noble_level
                        }
                        _this.globalData.userSid = {
                            uid: res.data.data.uid,
                            sid: res.data.data.sid,
                            ea_pass: res.data.data.ea_pass
                        }
                        wx.setStorageSync('uid', res.data.data.uid);
                        wx.setStorageSync('sid', res.data.data.sid);
                        wx.setStorageSync('openid', res.data.data.openid);
                        wx.navigateTo({
                            url: '../index/index',
                        })
                    }
                    if (utils.isFunction(callback)) {
                        console.log('123')
                        callback()
                    }
                }
            })
        } else {
            wx.login({

                success: function(res_login) {
                    if (res_login.code) {
                        wx.showLoading({
                            title: '正在登录',
                        })
                        if (result === undefined) {
                            wx.hideLoading()
                            return;
                        }
                        if (result.detail.errMsg != 'getUserInfo:ok') {
                            wx.hideLoading()
                            return;
                        }
                        wx.request({
                            url: 'https://shanshanapi.inke.cn/api/skill/wechat/get_user_info',
                            data: {
                                code: res_login.code,
                                encryptedData: result.detail.encryptedData,
                                iv: result.detail.iv,
                                cv: utils.getCv()
                            },
                            method: 'POST',
                            header: {
                                'content-type': 'application/json'
                            },
                            success: function(res) {
                                if (res.data.dm_error == 0) {
                                    _this.globalData.userInfo = res.data.profile;
                                    _this.globalData.senderInfo = {
                                        uid: res.data.profile.uid,
                                        nick: res.data.profile.nick,
                                        portrait: res.data.profile.portrait,
                                        level: res.data.profile.level,
                                        gender: res.data.profile.gender,
                                        noble_level: res.data.profile.noble_level
                                    }
                                    _this.globalData.userSid = {
                                        uid: res.data.uid,
                                        sid: res.data.sid
                                    }
                                    console.log(res.data)
                                    wx.setStorageSync('uid', res.data.uid);
                                    wx.setStorageSync('sid', res.data.sid);
                                    wx.setStorageSync('unionid', res.data.unionid);
                                    wx.setStorageSync('openid', res.data.openid);
                                    wx.setStorageSync('ea_pass', res.data.ea_pass);
                                    wx.hideToast()
                                    wx.navigateTo({
                                        url: '../index/index',
                                    })
                                }

                            }
                        })
                    }
                }

            })
        }
    },
    globalData: {
        userInfo: null,
        userSid: null,
        subscriber,
        messageList: {},
        rawMessageList: {},
        onlineList: {},
        currentChatTo: '',
        notificationList: [], // 通知列表
        config,
        nim: {}, //nim连接实例
        recentChatList: {}
    }
})