// pages/editor/editor.js
var app = getApp();
var api = require('../../requests/api.js');
var utils = require('../../utils/util.js');
var requests = require('../../requests/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nick:'',
    avatar:'',
    qq:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      nick: app.globalData.userInfo.nick,
      avatar: app.globalData.userInfo.portrait,
      qq: app.globalData.userInfo.qq ? app.globalData.userInfo.qq : '未绑定'
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
  changeNick:function(){
    wx.navigateTo({
      url: './info?id=1',
    })
  },
  changeQq: function () {
    wx.navigateTo({
      url: './info?id=2',
    })
  },
  changeAvatar:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(res.tempFilePaths)
        upload(that, tempFilePaths);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})

function upload(page, path) {
  wx.showToast({
    icon: "loading",
    title: "正在上传"
  }),
    wx.uploadFile({
      url: api.UPLOAD_AVATAR,
      name: 'file',
      filePath: path[0],
      header: { "Content-Type": "multipart/form-data" },
      formData: {
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showModal({
            title: '提示',
            content: '上传失败',
            showCancel: false
          })
          return;
        }
        page.setData({  //上传成功修改显示头像
          avatar: path[0]
        })
        var result = JSON.parse(res.data)
        var newportrait = result.file.url
        var query ={
          portrait: newportrait,
          uid: app.globalData.userInfo.uid
        }
        requests.postRequest(api.CHANGE_INFO, query).then(res => {
          if (res.data.dm_error == 0) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            })
            wx.hideToast()
            app.globalData.userInfo.portrait = newportrait
          }
        })
      },
      fail: function (e) {
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      },
      complete: function () {
        wx.hideToast();  //隐藏Toast
      }
    })
}