import AuRadioGroup from '../radio-group/_radio-group.js'
import dispatch from '../../mixins/_dispatch'

const AuRadio = Vue.extend({
  template: require('./_radio.jade'),
  mixins: [dispatch],
  model: {
    prop: 'checkedValue',
    event: 'input'
  },
  props: {
    checkedValue: [String, Number, Object],
    value: [String, Number, Object],
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    checked () {
      return this.model === this.value
    },
    isGroup () {
      return this.$parent instanceof AuRadioGroup
    },
    model: {
      get () {
        return this.isGroup ? this.$parent.value : this.checkedValue
      },
      set (value) {
        if (this.isGroup) {
          this.$parent.$emit('input', value)
        } else {
          this.$emit('input', value)
        }

        this.dispatch('blur.form', value)
      }
    }
  },
  methods: {
    clickHandler () {
      if (this.disabled) {
        return
      }

      this.model = this.value
    }
  },
  watch: {
    value () {
      this.dispatch('change.form', this.value)
    }
  }
})

Vue.component('au-radio', AuRadio)

export default AuRadio
