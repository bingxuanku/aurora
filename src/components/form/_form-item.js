import AuForm from '../form/_form.js'
import instance from '../../utils/_instance.js'
import dispatch from '../../mixins/_dispatch'
import Validator from '../validator/_validator.js'

const AuFormItem = Vue.extend({
  template: require('./_form-item.jade'),
  mixins: [dispatch],
  props: {
    label: {
      type: String,
      default: ''
    },
    labelPosition: String,
    labelWidth: [Number, String],
    rules: [ Array, Object ], // [{ required, type, message, trigger }]
    prop: String,
  },
  data () {
    return {
      form: null, // set by parent au-form
      message: '',
      validator: new Validator(),
      validateStatus: ''
    }
  },
  mounted () {
    this.validator.setRules(this.getRules())
    this.dispatch('register.form.item', this)

    this.$on('blur.form', this.onControlBlur);
    this.$on('change.form', this.onControlChange);
  },
  beforeDestroy () {
    this.dispatch('unregister.form.item', this)
  },
  computed: {
    _labelWidth () {
      return this.getProp('labelWidth')
    },
    _labelPosition () {
      return this.getProp('labelPosition')
    },
    isLabelTop () {
      return this._labelPosition === 'top'
    },
    labelStyle () {
      const style = {}
      if (!this.isLabelTop && this._labelWidth) {
        style.width = this._labelWidth + 'px'
      }
      return style
    },
    contentStyle () {
      const style = {}
      if (this.isLabelTop) {
        style.marginLeft = '0px'
        if (!this.label) {
          style.marginTop = '35px'
        }
      } else if (!this.label && this._labelWidth) {
        style.marginLeft = this._labelWidth + 'px'
      }
      return style
    },
    cls () {
      const cls = []
      if (this._labelPosition) {
        cls.push(`au-form-item-label-${this._labelPosition}`)
      }

      if (this.validateStatus === 'error') {
        cls.push(`au-form-item-error`)
      } else if (this.validateStatus === 'validating') {
        cls.push(`au-form-item-validating`)
      }

      if (this.isRequired) {
        cls.push(`au-form-item-required`)
      }

      if (!this.label) {
        cls.push(`au-form-item-not-label`)
      }

      return cls
    },
    inline () {
      return this.form ? this.form.inline : false
    },
    isRequired () {
      return this.getRules().some(rule => rule.required)
    }
  },
  methods: {
    onControlBlur () {
      this.$nextTick(() => {
        this.validate('blur')
      })
    },
    onControlChange () {
      this.$nextTick(() => {
        this.validate('change')
      })
    },
    getValue () {
      const model = this.form.model
      const path = this.prop

      if (model && path) {
        const found = instance.getPropByPath(model, path)
        if (found) {
          return found
        }
      }
      return null
    },
    getProp (name) {
      if (this[name]) {
        return this[name]
      }

      const form = this.form

      if (form) {
        return form[name] || ''
      }
    },
    validate (type, callback) {
      const rules = this.getRules()
      if (!rules || rules.length === 0) {
        callback && callback(true)
        return
      }

      this.validateStatus = 'validating'
      this.message = ''

      var value = this.getValue()
      value = value ? value.get() : null
      this.validator.setRules(rules)
      this.validator.validate(type, value, (messages) => {
        if (messages.length > 0) {
          this.validateStatus = 'error'
          this.message = messages[0]
        } else {
          this.validateStatus = 'success'
          this.message = ''
        }

        callback && callback(this.validateStatus === 'success')
      })
    },
    reset () {
      var value = this.getValue()
      if (value) {
        value.set('')
        this.validateStatus = ''
        this.message = ''
      }
    },
    getRules () {
      const form = this.form
      const rules = this.rules ? Array.isArray(this.rules) ? this.rules : [this.rules] : []
      if (form) {
        let formRules = form.rules && form.rules[this.prop] || []
        rules = rules.concat(formRules)
      }
      return rules
    },
    onRulesChange () {
      const rules = this.getRules()
      if (rules.length === 0) {
        const model = this.form.model
        const path = this.prop

        if (!model) {
          console.error(`form.model not provide in au-form-item: ${this.label}`)
        } else if (!path) {
          console.error(`prop not provide in au-form-item: ${this.label}`)
        }
      }
      this.validator.setRules(rules)
    }
  },
  watch: {
    rules () {
      this.onRulesChange()
    }
  }
})

Vue.component('au-form-item', AuFormItem)

export default AuFormItem
