import datetime from '../../utils/_datetime.js'
import datePicker from '../../mixins/_date-picker.js'

const AuYearPickerContent = Vue.extend({
  template: require('./_year-picker-content.jade'),
  mixins: [datePicker],
  props: {
    value: {
      type: Date,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      tempValue: this.value ? new Date(this.value) : new Date(),
      isDisabledFunc: datetime.getIsDisabledFuncByComponent(this, 'year')
    }
  },
  created () {
    this.reset()
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('change', value)
      }
    },
    currentYear () {
      return this.model ? this.model.getFullYear() : ''
    },
    startYear () {
      var value = new Date(this.tempValue)
      return Math.floor(value.getFullYear() / 10) * 10
    },
    endYear () {
      return this.startYear + 9
    },
    years () {
      const year = this.startYear
      const arr = []
      var value

      while (year <= this.endYear) {
        value = new Date(String(year))
        arr.push({
          year,
          value,
          isDisabled: this.isDisabledFunc(value)
        })
        year++
      }
      return arr
    }
  },
  methods: {
    reset () {
      this.tempValue = this.value ? new Date(this.value) : new Date()
    },
    setYear (year) {
      if (year.isDisabled) {
        return
      }
      const value = this.model ? new Date(this.model) : datetime.getClearDate()
      value.setFullYear(year.year)
      this.model = value
    },
    prevTenYear () {
      this.tempValue.setFullYear(this.tempValue.getFullYear() - 10)
      this.tempValue = new Date(this.tempValue)
      this.$emit('change.temp', this.tempValue)
    },
    nextTenYear () {
      this.tempValue.setFullYear(this.tempValue.getFullYear() + 10)
      this.tempValue = new Date(this.tempValue)
      this.$emit('change.temp', this.tempValue)
    }
  }
})

export default AuYearPickerContent
