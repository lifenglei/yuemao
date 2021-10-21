// pages/orderdetail/orderdetail.js
var app = getApp();
var api = require('../../requests/api.js');
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
var user_type;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        order_list: null,
        scrollHeight: '',
        count: 8,
        show: false,
        isload: Boolean,
        status: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    scrollHeight: res.windowHeight
                });
            }
        })
        console.log(options)
        user_type = options.user_type
        this.setData({
            status: user_type
        })
        if (user_type == 1) {
            wx.setNavigationBarTitle({
                title: '接单记录'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '下单记录'
            })
        }
        getOrdest.call(this)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        wx.setStorageSync('loadall', 'yuemao')
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    lower() {
        if (wx.getStorageSync('isload') == 'true') {
            wx.setStorageSync('isload', 'false')
            this.setData({
                count: this.data.count + 5,
            })
            if (wx.getStorageSync('loadall') == 'true') {
                return;
            }
            getOrdest.call(this)
        }
    }
})

function getOrdest() {
    var _this = this;
    utils.showLoading('正在加载')
    var url = api.GET_ORDERLIST;
    var data = {
        user_type: user_type,
        uid: app.globalData.userSid.uid,
        sid: app.globalData.userSid.sid,
        // uid:'207060',
        count: this.data.count,
        start: 0
    }
    requests.getRequest(url, data).then(res => {
        console.log(res.data)
        var result = res.data
        if (result.dm_error == 0) {
            _this.setData({
                order_list: result.order_list
            })
            console.log(result.order_list.length)
            if (result.order_list.length == 0) {
                utils.hideToast()
                _this.setData({
                    show: false
                })
                return;
            }
        }
        console.log(_this.data.order_list)
        if (result.order_list.length < this.data.count) {
            console.log('加载完毕')
            wx.setStorageSync('loadall', 'true')
            _this.setData({
                show: true
            })
        }
        utils.hideToast();
        wx.setStorageSync('isload', 'true')
    })
}