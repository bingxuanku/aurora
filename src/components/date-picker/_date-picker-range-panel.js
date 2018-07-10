import AuDatePickerPanel from './_date-picker-panel.js'
import dispatch from '../../mixins/_dispatch.js'
import datePicker from '../../mixins/_date-picker.js'

const AuDatePickerRangePanel = Vue.extend({
  template: require('./_date-picker-range-panel.jade'),
  mixins: [dispatch, datePicker],
  components: {
    AuDatePickerPanel
  },
  props: {
    value: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      status: 'free', // free, click1
      tempValue: [
        this.value[0] ? new Date(this.value[0]) : new Date(),
        this.value[1] ? new Date(this.value[1]) : new Date()
      ]
    }
  },
  computed: {
    leftValue: {
      get () {
        return this.value[0] ? new Date(this.value[0]) : null
      },
      set (value) {

      }
    },
    rightValue: {
      get () {
        return this.value[1] ? new Date(this.value[1]) : null
      },
      set (value) {

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

    this.updateRightContent(this.tempValue[0])
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
        this.tempValue = [value, null]

      } else if (this.status === 'click1') {
        const leftValue = this.tempValue[0]
        if (leftValue > value) {
          this.tempValue = [value, null]
          return
        }
        this.tempValue = [leftValue, value]
        this.$emit('input', this.tempValue)
        this.$emit('close')
        this.status = 'free'
      }
    },
    reset () {
      this.status = 'free'
      this.tempValue = [
        this.value[0] ? new Date(this.value[0]) : new Date(),
        this.value[1] ? new Date(this.value[1]) : new Date()
      ]
      this.$refs.leftContent.reset()
      this.$refs.rightContent.reset()
      this.$refs.leftContent.tempValue = this.leftValue || new Date()
      this.$nextTick(() => {
        this.updateRightContent(this.tempValue[0])
      })
    }
  }
})


export default AuDatePickerRangePanel
