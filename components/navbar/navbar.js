var e = require("./compare-version"),
    t = getApp().globalData.systemInfo,
    a = t.SDKVersion,
    o = t.version,
    i = t.platform,
    n = t.statusBarHeight,
    r = void 0 === n ? 20 : n,
    s = (0,
        e.compareVersion)(a, "1.7.0") >= 0 && (0, e.compareVersion)(o, "6.6.0") >= 0;

Component({
    properties: {
        title: {
            type: String,
            value: "标题"
        },
        light: {
            type: Boolean,
            value: !1
        },
        showHome: {
            type: Boolean,
            value: !0
        },
        bgColor: {
            type: String,
            value: "#EDEDED"
        },
        isHomePage: {
            type: Boolean,
            value: !1
        }
    },
    data: {
        showBack: !1,
        showComponent: s,
        statusBarHeight: r,
        platform: i,
        height: "android" === i ? 48 : 42
    },
    attached: function() {
        var e = {
            showBack: getCurrentPages().length > 1
        };
        this.properties.isHomePage && (e.height = this.data.height - 5), this.setData(e);
    },
    methods: {
        handleNavBack: function() {
            wx.navigateBack();
        },
        handleNavToHome: function() {
            wx.reLaunch({
                url: "/pages/index/index"
            });
        },
        handleTitleTap: function() {
            this.triggerEvent("titleTap");
        }
    }
});