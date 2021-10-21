
import originalData from './data'

const _xpt = 'components_calendar';
const _opt = {
  today: '2018-9-12' ,
  begin:'2018-9-13',
  end:'2018-9-18',
  disableLateMightModel: true,
  max:20,
  showMonths: 12
}

  Page({
    page: 2,
    _createdDays: 0, // 已生成的天数统计
    originalData: originalData,
    data: originalData,

    onLoad (options) {
      this.init()
      this.setScrollViewHeight()
    },

    onReady () {
    },

    select (e) {
      console.log('选中日期 >>>', e.target.dataset.date)
      const _d = e.target.dataset.date
      const _day = new Date(_d.day)
      const _today = this.data.today
      const _isLateMightModel = this.isLateMightModel(_day)
      const _start = this.data.start
      const _end = this.data.end
      const _maxSelectedDays = _opt.max || this.originalData.maxSelectedDays || 20
      const _endd = Math.round((_day - _start) / 86400000) + 1
      const _elongPhone = _opt.elongPhone||'400-666-1166'

      // 非日期栅格
      if (!_day || !_d.day) {
        // console.log('非日期栅格')
        return
      }

      // 今天之前的日期，并且不是深夜模式
      if (+_day < +_today && !_isLateMightModel) {
        // console.log('今天之前的日期，并且不是深夜模式')
        return
      }

      // 选中开始日期，且没有结束日期
      if (_start && +_start === +_day && !_end) {
        // console.log('选中开始日期，且没有结束日期')
        return
      }

      // 没有配置 showMonths 入参，且选中 180 天以外的日期
      if (!_opt.showMonths && _d.dayIndex > this.data.daysCount) {
        return
      }

      // 选中日期小于开始日期
      if (+_day < +_start && !_end) {
        // console.log('选中日期小于开始日期')

        this.originalData.start = _day
        this.originalData.end = null
        this.originalData.zh.title[0] = this.originalData.zh.title[2]

        this.setData({
          start: this.originalData.start,
          end: this.originalData.end,
          'zh.title': this.originalData.zh.title
        })
        return
      }

      // 选择区间不能大于 n 天
      if (_start && _end === null && _endd > _maxSelectedDays + 1) {
        // console.log('选择区间不能大于 ' + _maxSelectedDays + ' 天')
        wx.showModal({
          title: '提示',
          content: this.originalData.zh.overflow.replace('{{$max}}', _maxSelectedDays).replace('{{$elongPhone}}', _elongPhone),
          showCancel: false
        })
        return
      }

      // 不能入离同天
      if (_start && +_day === +_start && !_end) {
        // console.log('不能入离同天')
        return
      }

      // 选中开始日期
      if ((_start && _end) || (!_start && !_end)) {
        // console.log('选中开始日期', _day)

        this.originalData.start = _day
        this.originalData.end = null
        this.originalData.zh.title[0] = this.originalData.zh.title[2]

        this.setData({
          start: this.originalData.start,
          end: this.originalData.end,
          'zh.title': this.originalData.zh.title
        })

        return
      }

      // 选中结束日期
      if (_start && !_end) {
        // console.log('选中结束日期', _day)

        this.originalData.start = _start
        this.originalData.end = _day
        this.originalData.zh.title[0] = this.originalData.zh.title[1]

        this.setData({
          start: this.originalData.start,
          end: this.originalData.end,
          'zh.title': this.originalData.zh.title
        })

        // 通知
        // this.fireEvent('select', {
        //   start: this.originalData.start,
        //   end: this.originalData.end
        // })

        // 打点
        // 返回
        this.setData({
          showMask: true
        })
        setTimeout(() => {
          wx.navigateBack()
          this.setData({
            showMask: false
          })
        }, 300)
      }
    },

    init () {
      // TODO: 校验 begin/end 是否合法//this.data._options
      const _today = _opt.today ? new Date(_opt.today) : new Date(_opt.today)
      const _initStart = this.initStart(_opt.begin, _today)
      const _start = this.initStart(_opt.begin, _today)
      const _initEnd = this.initEnd(_opt.end, _today)
      const _end = this.initEnd(_opt.end, _today)
      const _date = (start => {
        const begin = new Date(Math.min(start, new Date(_opt.today)))
        return new Date(begin.getFullYear(), begin.getMonth() + 1, 0)
      })(_opt.start || _start)
      const _monthsCount = _opt.showMonths || this.originalData.monthsCount
      const _daysCount = _opt.showMonths ? 0 : this.originalData.daysCount

      // 设置整点
      _today.setHours(0)
      _today.setMinutes(0)
      _today.setSeconds(0)
      _today.setMilliseconds(0)

      let _rData = {
        today: _today,
        initStart: _initStart,
        initEnd: _initEnd,
        start: _start,
        end: _end,
        date: _date,
        monthsCount: _monthsCount,
        daysCount: _daysCount,
        dates: {},
        keys: [],
        keysStr: []
      }
      this.originalData = Object.assign({}, this.originalData, _rData)

      // 月份压栈
      const _pushMonths = i => {
        const _newDate = new Date(_date.getFullYear(), _date.getMonth() + i, 1)
        let key = this.getDateString(_newDate, this.originalData.zh.split, true)
        _rData.dates[key] = this.createDate(_newDate)
        _rData.keys[i] = key
        _rData.keysStr[i] = key.split('/').join('_')
      }

      for (let i = 0; i < _rData.monthsCount; i++) {
        _pushMonths(i)
        if (i === _rData.monthsCount - 1 && _daysCount && this._createdDays <= _daysCount) {
          _pushMonths(_rData.monthsCount)
        }
      }

      // scroll-view 所在位置
      _rData.toView = 'm_' + this.getDateString(_start, this.originalData.zh.split, true).split('/').join('_')

      // 如果当前时间是1日00:00-05:00，则生成上个月的日历
      const _todayDate = new Date(_today)
      const _nowHours = _todayDate.getHours()
      if (_nowHours >= 0 && _nowHours <= 5 && !_opt.disableLateMightModel && _todayDate.getDate() === 1) {
        const _newDate = new Date(_todayDate.getFullYear(), _todayDate.getMonth() - 1, 1)
        let key = this.getDateString(_newDate, this.originalData.zh.split, true)

        if (!_rData.dates[key]) {
          _rData.dates[key] = this.createDate(_newDate)
          _rData.keys.unshift(key)
          _rData.keysStr.unshift(key.split('/').join('_'))
        }
      }

      this.setData(_rData)
      this.originalData = Object.assign({}, this.originalData, _rData)
    },

    initStart (start, today) {
      if (typeof start === 'string') {
        start = start.replace(/-/g, '/')
      }
      if (start) {
        return new Date(start)
      }
      let n = new Date(today)
      let t = n.getHours()
      if (t >= 0 && t <= 5 && !_opt.disableLateMightModel) {
        n.setDate(n.getDate() - 1)
      }
      n.setHours(0)
      n.setMinutes(0)
      n.setSeconds(0)
      n.setMilliseconds(0)
      return n
    },

    initEnd (end, today) {
      if (typeof end === 'string') {
        end = end.replace(/-/g, '/')
      }
      if (end) {
        return new Date(end)
      }
      let n = new Date(today)
      let t = n.getHours()
      if (!(t >= 0 && t <= 5 && !_opt.disableLateMightModel)) {
        n.setDate(n.getDate() + 1)
      }
      n.setHours(0)
      n.setMinutes(0)
      n.setSeconds(0)
      n.setMilliseconds(0)
      return n
    },

    createDate (date) {
      let returnValue = {}
      const beginDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
      const nDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      let dateObj = {
        day: '',
        value: '',
        showDay: '',
        txt: ''
      }

      const len = 43 - (42 - nDays - beginDay)
      const _serverTime = new Date()
      const _today = new Date(_serverTime.getFullYear(), _serverTime.getMonth(), _serverTime.getDate(), 0, 0, 0)

      for (let i = 1; i < len; i++) {
        const tempDate = new Date(date.getFullYear(), date.getMonth(), (i - beginDay), 0, 0, 0)
        let tempDateStr = this.getDateString(tempDate)
        if (i > beginDay && i <= nDays + beginDay) {
          const _day = i - beginDay
          const _isLateMightModel = this.isLateMightModel(tempDate)
          dateObj = {
            day: tempDateStr,
            value: _day,
            festival: this.getFestival(tempDateStr) || '',
            holiday: this.getHoliday(tempDateStr) || '',
            isLateMightModel: _isLateMightModel,
            isToday: +new Date(this.originalData.today) === +new Date(tempDateStr),
            dayIndex: -1
          }

          // 统计已生成的可选天数
          if (+tempDate >= +_today) {
            this._createdDays++
            dateObj['dayIndex'] = this._createdDays
          }
        }
        returnValue[tempDateStr] = dateObj
      }
      return returnValue
    },

    getDateString (date, split, isMonth) {
      if (typeof date === 'string') {
        date = new Date(date)
      }
      split = split || this.originalData.zh.split
      let tempArr = [date.getFullYear(), date.getMonth() + 1]
      !isMonth && tempArr.push(date.getDate())
      return tempArr.join(split)
    },

    isLateMightModel (target) {
      // const time = new Date('2018-03-08 03:00:00')
      const time = new Date()
      const t = time.getHours()
      const _disaled = _opt.disableLateMightModel
      return _disaled ? !_disaled : (t < 5 && (+target + 86400000) === +this.originalData.today)
    },

    getFestival (date) {
      const md = [date.split('/')[1], date.split('/')[2]].join('/')
      return this.originalData.festivaltag[md] || this.originalData.cnfestivaltag[date]
    },

    getHoliday (date) {
      return this.originalData.holidaytag[date]
    },

    setScrollViewHeight () {
      this.setData({
        toView: this.data.toView,
        scrollViewHeight: wx.getSystemInfoSync().windowHeight
      })
    }
  })

