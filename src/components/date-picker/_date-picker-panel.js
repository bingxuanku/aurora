import AuYearPickerContent from './_year-picker-content.js'
import AuMonthPickerContent from './_month-picker-content.js'
import AuDatePickerContent from './_date-picker-content.js'

const AuDatePickerPanel = Vue.extend({
  template: require('./_date-picker-panel.jade'),
  components: {
    AuYearPickerContent,
    AuMonthPickerContent,
    AuDatePickerContent
  },
  props: {
    value: {
      type: Date,
      default () {
        return null
      }
    },
    range: {
      type: Array,
      default () {
        return null
      }
    },
    leftRange: Boolean,
    rightRange: Boolean,
    startDate: [String, Date],
    endDate: [String, Date],
    disabledDate: Function
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
        this.$emit('close')
      }
    }
  },
  data () {
    return {
      tempValue: this.value ? new Date(this.value) : new Date(),
      type: 'date'
    }
  },
  mounted () {
    this.$refs.monthContent.$on('showYearPanel', () => {
      this.type = 'year'
      this.$refs.yearContent.tempValue = this.$refs.monthContent.tempValue
    })

    this.$refs.dateContent.$on('showYearPanel', () => {
      this.type = 'year'
      this.$refs.yearContent.tempValue = this.$refs.dateContent.tempValue
    })

    this.$refs.dateContent.$on('showMonthPanel', () => {
      this.type = 'month'
      this.$refs.monthContent.tempValue = this.$refs.dateContent.tempValue
    })

    this.$refs.yearContent.$on('change', (value) => {
      this.$refs.monthContent.tempValue = value
      this.type = 'month'
    })

    this.$refs.monthContent.$on('change', (value) => {
      this.$refs.dateContent.tempValue = value
      this.type = 'date'
      this.$emit('change.temp', value)
    })

    this.$refs.monthContent.$on('change.temp', (value) => {
      this.tempValue = value
      this.$emit('change.temp', this.tempValue)
    })

    this.$refs.dateContent.$on('change', (value) => {
      this.model = value
    })

    this.$refs.dateContent.$on('change.temp', (value) => {
      this.tempValue = value
      this.$emit('change.temp', this.tempValue)
    })

    this.$refs.dateContent.$on('click.range', (value) => {
      this.$emit('click.range', value)
    })
  },
  methods: {
    reset () {
      this.type = 'date'
      this.syncTempValue()
    },
    syncTempValue () {
      const $refs = this.$refs
      const value

      if (this.range) {
        value = new Date(this.tempValue)
      } else {
        value = this.value ? new Date(this.value) : new Date()
      }

      $refs.yearContent.tempValue = value
      $refs.monthContent.tempValue = value
      $refs.dateContent.tempValue = value
    }
  },
  watch: {
    tempValue (value) {
      this.$refs.monthContent.tempValue = value
      this.$refs.yearContent.tempValue = value
      this.$refs.dateContent.tempValue = value
    }
  }
})


export default AuDatePickerPanel
