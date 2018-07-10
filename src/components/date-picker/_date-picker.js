import Popup from '../popup/_popup.js'
import AuDatePickerPanel from './_date-picker-panel.js'
import AuYearPickerPanel from './_year-picker-panel.js'
import AuMonthPickerPanel from './_month-picker-panel.js'
import AuDatePickerRangePanel from './_date-picker-range-panel.js'
import AuTimePickerPanel from './_time-picker-panel.js'
import AuDateTimePickerPanel from './_date-time-picker-panel.js'
import AuDateTimePickerRangePanel from './_date-time-picker-range-panel.js'
import dispatch from '../../mixins/_dispatch'
import datePicker from '../../mixins/_date-picker.js'

import dateFormat from '../../libs/dateformat.js'

const AuDatePicker = Vue.extend({
  template: require('./_date-picker.jade'),
  mixins: [dispatch, datePicker],
  components: {
    Popup,
    AuYearPickerPanel,
    AuMonthPickerPanel,
    AuDatePickerPanel,
    AuDateTimePickerPanel,
    AuDatePickerRangePanel,
    AuTimePickerPanel,
    AuDateTimePickerRangePanel
  },
  props: {
    value: [String, Date, Array],
    type: {
      type: String, // year, month, date, datetime, daterange, datetimerange, time
      default: 'date'
    },
    format: {
      type: String,
      default (...args) {
        switch (this.type) {
          case 'year':
            return 'yyyy'
          case 'month':
            return 'yyyy-mm'
          case 'date': case 'daterange':
            return 'yyyy-mm-dd'
          case 'time':
            return 'HH:MM:ss'
          case 'datetime': default:
            return 'yyyy-mm-dd HH:MM:ss'
        }
      }
    },
    clearable: Boolean,
    placeholder: String
  },
  computed: {
    model: {
      get () {
        value = this.value

        if (this.type === 'daterange' || this.type === 'datetimerange') {
          return value.map((item) => {
            return this.getDateByString(item)
          })
        } else if (this.type === 'time') {
          const date = new Date()
          const arr = value.split(':')
          const formatArr = this.format.split(':')

          formatArr.some((format, index) => {
            if (arr[index] == null) {
              return false
            }
            if (format === 'HH') {
              date.setHours(arr[index])
            } else if (format === 'MM') {
              date.setMinutes(arr[index])
            } else if (format === 'ss') {
              date.setSeconds(arr[index])
            }
          })

          return date
        } else {
          return this.getDateByString(value)
        }
      },
      set (value) {
        if (this.type === 'daterange' || this.type === 'datetimerange') {
          value = value.map(this.getFormatDatetime)
        } else {
          value = this.getFormatDatetime(value)
        }
        this.$emit('input', value)
        this.$emit('change', value)
      }
    },
    datetime () {
      return this.model ? this.getFormatDatetime(this.model) : ''
    },
    defaultIcon () {
      return this.type === 'time' ? 'clock-o' : 'calendar-o'
    },
    cls () {
      return ['au-date-picker-' + this.type]
    }
  },
  data () {
    return {
      tempValue: new Date(this.value),
      popup: null,
      panel: null,
      inputActive: false,
      icon: null
    }
  },
  created () {
    this.$on('close.panel', () => {
      this.hidePopup()
      return false
    })
  },
  mounted () {
    this.icon = this.defaultIcon
  },
  methods: {
    getDateByString (value) {
      if (!value) {
        return null
      }

      if (navigator.userAgent.indexOf('Firefox') > -1) {
        if (value.indexOf(':') > -1) {
          value = value.replace(/-/g, '/')
        }
      }
      return new Date(value)
    },
    isEmptyValue () {
      if (this.type === 'daterange' || this.type === 'datetimerange') {
        return !this.value[0] && !this.value[1]
      } else {
        return !this.value
      }
    },
    getFormatDatetime (value) {
      if (!value) {
        return ''
      }

      if (Array.isArray(value)) {
        if (!value[0] || !value[1]) {
          return ''
        }

        return value.map((item) => {
          return this.getFormatDatetime(item)
        }).join(' ~ ')
      }
      return dateFormat(value, this.format)
    },
    reset () {
      this.tempValue = new Date(this.value)
      if (this.panel) {
        this.panel.reset()
      }
    },
    clickHandler ($event) {
      $event.stopPropagation()
      if (this.$refs.popup.isShow) {
        this.hidePopup()
      } else {
        this.showPopup()
      }
    },
    showPopup () {
      this.reset()

      if (!this.popup) {
        this.popup = this.$refs.popup
        this.panel = this.popup.$children[0]

        this.panel.$on('close', () => {
          this.hidePopup()
        })

        this.panel.reset()

        this.popup.setRelateElem(this.$el)

        document.body.appendChild(this.popup.$el)

        this.popup.$on('show', () => {
          this.inputActive = true
          this.$nextTick(() => {
            this.popup.broadcast('show.popup')
          })
        })

        this.popup.$on('hide', () => {
          this.inputActive = false
          this.$nextTick(() => {
            this.popup.broadcast('hide.popup')
          })
        })
      }

      this.popup.show()
    },
    hidePopup () {
      this.popup.hide()
    },
    clearDatetime () {
      if (this.type === 'daterange' || this.type === 'datetimerange') {
        this.model = ['', '']
      } else {
        this.model = ''
      }
    },
    clickIconHandler ($event) {
      if (this.clearable && !this.isEmptyValue()) {
        $event.stopPropagation()
        this.clearDatetime()
        this.icon = this.defaultIcon
      }
    },
    mouseoverIconHandler () {
      if (this.clearable && !this.isEmptyValue()) {
        this.icon = 'close'
      }
    },
    mouseoutIconHandler () {
      this.icon = this.defaultIcon
    }
  }
})

Vue.component('au-date-picker', AuDatePicker)

export default AuDatePicker
