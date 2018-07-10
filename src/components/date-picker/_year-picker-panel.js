import AuYearPickerContent from './_year-picker-content.js'
import datePicker from '../../mixins/_date-picker.js'

const AuYearPickerPanel = Vue.extend({
  template: require('./_year-picker-panel.jade'),
  mixins: [datePicker],
  components: {
    AuYearPickerContent
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
  mounted () {
    this.$refs.yearContent.$on('change', (value) => {
      this.model = value
    })

    this.$refs.yearContent.$on('change.temp', (value) => {
      this.$emit('change.temp', value)
    })
  },
  methods: {
    reset () {
      this.$refs.yearContent.reset()
    }
  }
})

export default AuYearPickerPanel
