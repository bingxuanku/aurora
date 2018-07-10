import AuYearPickerContent from './_year-picker-content.js'
import AuMonthPickerContent from './_month-picker-content.js'
import datePicker from '../../mixins/_date-picker.js'

const AuMonthPickerPanel = Vue.extend({
  template: require('./_month-picker-panel.jade'),
  mixins: [datePicker],
  components: {
    AuYearPickerContent,
    AuMonthPickerContent
  },
  props: {
    value: Date,
    default () {
      return null
    }
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
      type: 'month'
    }
  },
  mounted () {
    this.$refs.monthContent.$on('showYearPanel', () => {
      this.type = 'year'
      this.$refs.yearContent.tempValue = this.$refs.monthContent.tempValue
    })

    this.$refs.yearContent.$on('change', (value) => {
      this.$refs.monthContent.tempValue = value
      this.type = 'month'
    })

    this.$refs.monthContent.$on('change', (value) => {
      this.model = value
    })

    this.$refs.monthContent.$on('change.temp', (value) => {
      this.tempValue = value
    })
  },
  methods: {
    initTempValue () {
      this.tempValue = this.value ? new Date(this.value) : new Date()
    },
    reset () {
      this.initTempValue()
      this.type = 'month'
      this.$refs.monthContent.reset()
      this.$refs.yearContent.reset()
    }
  },
  watch: {
    value (value) {
      this.initTempValue()
    }
  }
})

export default AuMonthPickerPanel
