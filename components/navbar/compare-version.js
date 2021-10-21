function e(i, r) {
    var s = i.split("."), t = r.split("."), o = s[0] - t[0];
    return 0 == o && i != r ? e(s.splice(1).join("."), t.splice(1).join(".")) : o;
}

Object.defineProperty(exports, "__esModule", {
    value: !0
}), exports.compareVersion = e;