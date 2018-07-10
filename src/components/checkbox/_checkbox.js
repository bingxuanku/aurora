import dispatch from '../../mixins/_dispatch'

const AuCheckbox = Vue.extend({
  template: require('./_checkbox.jade'),
  mixins: [dispatch],
  model: {
    prop: 'checkedValue',
    event: 'input'
  },
  props: {
    value: {
      type: [String, Number, Boolean, Object],
      default () {
        return true
      }
    },
    checkedValue: [String, Number, Boolean, Array, Object],
    label: String,
    indeterminate: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  created () {
    if (this.value === true && (this.checkedValue == null || this.checkedValue === '')) {
      this.$emit('input', false)
    }
  },
  computed: {
    checked () {
      return Array.isArray(this.checkedValue)
           ? this.checkedValue.indexOf(this.value) > -1
           : this.checkedValue === this.value
    }
  },
  methods: {
    clickHandler ($event) {
      if (this.disabled) {
        return
      }

      if (Array.isArray(this.checkedValue)) {
        const value = this.checkedValue.slice()
        const pos = value.indexOf(this.value)

        if (this.checked) {
          if (pos > -1) {
            value.splice(pos, 1)
          }
        } else {
          if (pos === -1) {
            value.push(this.value)
          }
        }
        this.$emit('input', value)
      } else {
        this.$emit('input', this.checked ? (this.value === true ? false : '') : this.value)
      }

      this.dispatch('blur.form', value)
    }
  },
  watch: {
    value () {
      this.dispatch('change.form', this.value)
    }
  }
})

Vue.component('au-checkbox', AuCheckbox)

export default AuCheckbox
