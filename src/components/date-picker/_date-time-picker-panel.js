import Popup from '../popup/_popup.js'
import AuDatePickerPanel from './_date-picker-panel.js'
import AuTimePickerPanel from './_time-picker-panel.js'
import dateFormat from '../../libs/dateformat.js'
import dispatch from '../../mixins/_dispatch'
import datePicker from '../../mixins/_date-picker.js'

const AuDateTimePickerPanel = Vue.extend({
  template: require('./_date-time-picker-panel.jade'),
  mixins: [dispatch, datePicker],
  components: {
    Popup,
    AuDatePickerPanel,
    AuTimePickerPanel
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
    isShowBottomBar: {
      type: Boolean,
      default: true
    },
    fixedTempValue: Boolean,
    format: String
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
        this.$nextTick(() => {
          this.broadcast('check.isDisabled')
        })
      }
    },
    timeModel: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    date () {
      const formatArr = this.format.split(/\s/)
      return this.model ? dateFormat(this.model, formatArr[0]) : ''
    },
    time () {
      const formatArr = this.format.split(/\s/)
      return this.model ? dateFormat(this.model, formatArr[1]) : ''
    }
  },
  data () {
    return {
      tempValue: new Date(this.value),
      popup: null
    }
  },
  created () {
    this.$on('hide.popup', () => {
      this.hideTimePicker()
    })

    this.$on('close.panel', () => {
      this.hideTimePicker()
      return false
    })
  },
  mounted () {
    this.$refs.datePicker.$on('change.temp', (value) => {
      this.tempValue = value
      this.$emit('change.temp', value)
    })

    this.$refs.datePicker.$on('click.range', (value) => {
      this.$emit('click.range', value)
    })

    this.$refs.timePicker.$on('input', (value) => {
      this.$emit('change.time', value)
    })
  },
  methods: {
    reset () {
      this.initTempValue()
      this.$refs.datePicker && this.$refs.datePicker.reset()
      this.$refs.timeModel && this.$refs.timeModel.reset()
    },
    initTempValue () {
      this.tempValue = this.value ? new Date(this.value) : new Date()
    },
    showTimePicker () {
      if (!this.popup) {
        this.popup = this.$refs.popup
        this.popup.setRelateElem(this.$refs.timeInput.$el)
        document.body.appendChild(this.popup.$el)
      }

      this.popup.show()
      this.$nextTick(() => {
        this.broadcast('show.popup')
      })
    },
    hideTimePicker () {
      if (this.popup) {
        this.popup.hide()
      }
    },
    inputClickHandler ($event) {
      $event.stopPropagation()
      if (!this.popup || !this.popup.isShow) {
        this.showTimePicker()
      } else {
        this.hideTimePicker()
      }
    },
    clickHandler () {
      this.hideTimePicker()
    },
    closeHandler () {
      this.$emit('close')
    }
  },
  watch: {
    value () {
      if (!this.fixedTempValue) {
        this.initTempValue()
      }
    },
    tempValue (value) {
      this.$refs.datePicker.tempValue = value
    }
  }
})

export default AuDateTimePickerPanel
