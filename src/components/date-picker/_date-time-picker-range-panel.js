import AuDateTimePickerPanel from './_date-time-picker-panel.js'
import datePicker from '../../mixins/_date-picker.js'
import dispatch from '../../mixins/_dispatch.js'

const AuDateTimePickerRangePanel = Vue.extend({
  template: require('./_date-time-picker-range-panel.jade'),
  mixins: [dispatch, datePicker],
  components: {
    AuDateTimePickerPanel
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    format: String
  },
  data () {
    return {
      status: 'free', // free, click1
      displayValue: [
        this.value[0] ? new Date(this.value[0]) : null,
        this.value[1] ? new Date(this.value[1]) : null
      ],
      tempValue: [
        this.value[0] ? new Date(this.value[0]) : new Date(),
        this.value[1] ? new Date(this.value[1]) : new Date()
      ]
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {

      }
    },
    leftValue: {
      get () {
        return this.displayValue[0]
      },
      set (value) {
        this.displayValue = [value, this.rightValue]
      }
    },
    rightValue: {
      get () {
        return this.displayValue[1]
      },
      set (value) {
        this.displayValue = [this.leftValue, value]
      }
    }
  },
  created () {
    this.$on('mouseover.item.datePickerContent', (value) => {
      this.broadcast('mouseover.item.datePickerContent', value)
      return false
    })
  },
  mounted () {
    const $refs = this.$refs
    $refs.leftContent.$on('change.temp', this.updateRightContent)
    $refs.rightContent.$on('change.temp', this.updateLeftContent)

    $refs.leftContent.$on('click.range', this.clickItem)
    $refs.rightContent.$on('click.range', this.clickItem)

    $refs.leftContent.$on('change.time', (value) => {
      this.$emit('input', [value, this.value[1]])
    })

    $refs.rightContent.$on('change.time', (value) => {
      this.$emit('input', [this.value[0], value])
    })

    this.updateRightContent(this.leftValue || new Date())
  },
  methods: {
    updateLeftContent (value) {
      value = new Date(value)
      value.setMonth(value.getMonth() - 1)
      this.$refs.leftContent.tempValue = value
    },
    updateRightContent (value) {
      value = new Date(value)
      value.setMonth(value.getMonth() + 1)
      this.$refs.rightContent.tempValue = value
    },
    clickItem (value) {
      if (this.status === 'free') {
        this.status = 'click1'
        this.displayValue = [value, this.displayValue[1]]
        this.tempValue = [value, null]

      } else if (this.status === 'click1') {
        const leftValue = this.tempValue[0]
        if (leftValue > value) {
          this.tempValue = [value, null]
          return
        }
        this.displayValue = [this.displayValue[0], value]
        this.tempValue = [leftValue, value]
        this.$emit('input', this.tempValue)
        this.$emit('close')
        this.status = 'free'
      }
    },
    reset () {
      this.status = 'free'
      this.displayValue = [
        this.value[0] ? new Date(this.value[0]) : null,
        this.value[1] ? new Date(this.value[1]) : null
      ]
      this.tempValue = [
        this.value[0] ? new Date(this.value[0]) : new Date(),
        this.value[1] ? new Date(this.value[1]) : new Date()
      ]
      this.$refs.leftContent.reset()
      this.$refs.rightContent.reset()
      this.$refs.leftContent.tempValue = this.leftValue || new Date()
      this.$nextTick(() => {
        this.updateRightContent(this.leftValue || new Date())
      })
    },
    closeHandler () {
      this.$emit('close')
    }
  }
})

export default AuDateTimePickerRangePanel
