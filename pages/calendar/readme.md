# 日历组件

- 调用方式：

  ```javascript
  openCalendar () {
      const calendar = api.navigateTo({
          url: '/page/hotel/components/calendar/index',
          params: {
              begin: this.data.calendar.begin,
              end: this.data.calendar.end,
              max: 20,
              disableLateMightModel: true,
            	showMonths: 12
          }
      })

      calendar.on('select', res => {
          this.setData({
              calendar: {
                  begin: res.start,
                  end: res.end
              }
          })
      })
  }
  ```

- 入参说明：

| 参数                  | 类型                 | 是否必填 | 默认值 | 说明                     |
| :-------------------- | :------------------- | :------- | :----- | :----------------------- |
| begin                 | String / Date Object | 否       | 今天   | 入住日期                 |
| end                   | String / Date Object | 否       | 明天   | 离店日期                 |
| max                   | Number               | 否       | 20     | 最大可选天数             |
| disableLateMightModel | Boolean              | 否       | false  | 是否关闭深夜模式         |
| showMonths            | Number               | 否       | 6      | 展示的月份数，从当月开始 |

- 返回值说明：

| 参数  | 类型        | 说明     |
| :---- | :---------- | :------- |
| start | Date Object | 入住日期 |
| end   | Date Object | 离店日期 |

