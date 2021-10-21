//初始化数据
function tabbarinit() {
  return [
    {
      "current": 0,
      "text": "首页",
      "pagePath": "../index/index",
      "iconPath": "../../images/home.png",
      "selectedIconPath": "../../images/selected-home.png"
    },
    {
      "current": 0,
      "text": "消息",
      "pagePath": "../recentchat/recentchat",
      "iconPath": "../../images/yunxin1.png",
      "selectedIconPath": "../../images/yunxin2.png"
    },
    {
      "current": 0,
      "text": "我的",
      "pagePath": "../home/home",
      "iconPath": "../../images/man.png",
      "selectedIconPath": "../../images/selected-man.png"
    }
  ]

}

/**
 * tabbar主入口
 * @param  {String} bindName 
 * @param  {[type]} id       [表示第几个tabbar，以0开始]
 * @param  {[type]} target   [当前对象]
 */
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ 
    bindData:bindData,
   });
   console.log(that)
}
function unreadNum(target){
  var that = target;
  that.setData({
    unread:0
  })
}


module.exports = {
  tabbar: tabbarmain,
  unreadNum: unreadNum
}