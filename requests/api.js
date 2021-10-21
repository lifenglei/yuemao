/**
 * 请求地址
 */
const API_BASE = "https://shanshanapi.inke.cn/";//小程序合法request请求地址
const VOICE_URL = 'http://voc.inke.cn/';//音频地址
module.exports={

  API_CHECK_SID : API_BASE +'api/user/check_sid',//检查sid是否过期
  API_GET_BANNER: API_BASE +'api/service/banner/list',//获取首页banner
  API_GET_YUEMAO: API_BASE + 'api/home/index/list',//获取首页月猫列表
  API_GET_INFO: API_BASE +'api/skill/wechat/get_wx_user_info',//获取用户绑定的月猫信息
  API_GET_DETAIL: API_BASE +'api/home/user/info',//获取查看月猫的详细信息
  VOICE_URL: VOICE_URL,
  PERSON_INFO: API_BASE +'api/home/my/info',//获取用户个人中心信息
  GET_ORDER: API_BASE +'api/order/create',//创建订单
  PAY_MONEY: API_BASE +'api/pay/create',//创建支付 唤起微信支付
  CHANGE_INFO: API_BASE +'api/user/user_profile_update',//更改个人中心用户信息
  GET_ORDERLIST: API_BASE +'api/order/list',//获取订单列表
  GET_ORDER_DETAIL: API_BASE +'api/order/info',//获取订单详情
  FINISH_ORDER: API_BASE +'api/order/consumer_status',//完成订单
  UPLOAD_AVATAR: API_BASE +'api/service/upload/image',//上传头像
  SEND_MESSAGE: API_BASE +'api/user/chat/chat_msg_send',//发送消息
  GET_CHATER_INFO: API_BASE +'api/user/infos',//个人信息
  GET_USER_SHIELD: API_BASE +'api/user/get_user_shield',//获取拉黑状态
  GET_MY_CHATROOM: API_BASE +'api/skill/radio/my_room',//获取聊天室
  APPLY_ON_CHAT:API_BASE+'api/skill/radio/apply_up_mic',//申请上麦
  COME_IN_CHATROOM: API_BASE +'api/skill/radio/enter_room',//进入聊天室
  GET_OFF_MAI: API_BASE +'api/skill/radio/down_mic',//下麦
  SEND_CHATROOM_MESSAGE: API_BASE +'api/skill/radio/send_msg',//聊天室发送消息
  GIFT_WALL: API_BASE +'api/skill/gift/get_gift_list',//聊天室礼物墙信息
  SEND_GIFT_TO_LIKE: API_BASE +'api/skill/gift/send_gift',//发送礼物
  LEAVE_ROOM: API_BASE +'api/skill/radio/out_room'
  }