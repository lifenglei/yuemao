// 配置
var envir = 'online',
  CONFIG = {},
  configMap = {
    test: {
      appkey: '2b5c61a43bb86c397c4c314281d7539f',
      url: 'https://apptest.netease.im'
    },

    pre: {
      appkey: '2b5c61a43bb86c397c4c314281d7539f',
      url: 'http://preapp.netease.im:8184'
    },
    online: {
      appkey: '2b5c61a43bb86c397c4c314281d7539f',
      url: 'https://app.netease.im'
    }
  };
CONFIG = configMap[envir];
// 是否开启订阅服务
CONFIG.openSubscription = true

module.exports = CONFIG