export default {
  getDateDisabledFunc (type, value, compareType) {
    if (!value) {
      return function () { return true }
    }

    if (typeof value === 'string') {
      if (value.match(/^\d{2}:\d{2}:\d{2}$/) != null) {
        const arr = value.split(':')
        value = new Date()
        value.setHours(parseInt(arr[0], 10))
        value.setMinutes(parseInt(arr[1], 10))
        value.setSeconds(parseInt(arr[2], 10))
      } else {
        value = new Date(value)
      }
    }

    return (date) => {
      if (type === 'startDate') {
        return this.compareDate(compareType, value, date) < 0
      } else {
        return this.compareDate(compareType, value, date) > 0
      }
    }
  },

  // compare two dates
  // if date1 > date2 return negetive number
  // if date1 == date2 return 0
  // if date1 < date2 return positive number
  compareDate (compareType, date1, date2) {
    const value1 = date1.getFullYear()
    const value2 = date2.getFullYear()
    const compareTime = compareType in { hour: true, minute: true, second: true}

    if (compareType === 'month' || compareType === 'date' || compareTime) {
      value1 += this.formatDateUnit(date1.getMonth() + 1)
      value2 += this.formatDateUnit(date2.getMonth() + 1)
    }

    if (compareType === 'date' || compareTime) {
      value1 += this.formatDateUnit(date1.getDate())
      value2 += this.formatDateUnit(date2.getDate())
    }

    if (compareType === 'hour' || compareType === 'minute' || compareType === 'second') {
      value1 += this.formatDateUnit(date1.getHours())
      value2 += this.formatDateUnit(date2.getHours())
    }

    if (compareType === 'minute' || compareType === 'second') {
      value1 += this.formatDateUnit(date1.getMinutes())
      value2 += this.formatDateUnit(date2.getMinutes())
    }

    if (compareType === 'second') {
      value1 += this.formatDateUnit(date1.getSeconds())
      value2 += this.formatDateUnit(date2.getSeconds())
    }

    value1 = parseInt(value1, 10)
    value2 = parseInt(value2, 10)

    return value2 - value1
  },

  formatDateUnit (value) {
    value = String(value)
    if (value.length < 2) {
      value = '0' + value
    }
    return value
  },

  getTimeNumber (hour, minute, second) {
    return hour * 60 * 60 + minute * 60 + second
  },
  getIsDisabledDate (date, funcs) {
    const result = false
    funcs.some((fun) => {
      if (result = fun(date)) {
        return true
      }
    })
    return result
  },

  getIsDisabledFuncByComponent (component, compareType = 'date') {
    const funcs = []

    if (component.disabledDate) {
      funcs.push(component.disabledDate)
    }

    if (component.startDate) {
      funcs.push(this.getDateDisabledFunc('startDate', component.startDate, compareType))
    }

    if (component.endDate) {
      funcs.push(this.getDateDisabledFunc('endDate', component.endDate, compareType))
    }

    if (funcs.length === 0) {
      return function () { return false }
    }

    return (date) => {
      return this.getIsDisabledDate(date, funcs)
    }
  },
  getClearDate () {
    const date = new Date()

    date.setMonth(0)
    date.setDate(1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)

    return date
  }
}
