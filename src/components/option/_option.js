import dispatch from '../../mixins/_dispatch.js'
const AuOption = Vue.extend({
  mixins: [dispatch],
  template: require('./_option.jade'),
  props: {
    label: String,
    value: [String, Number, Object]
  },
  data () {
    return {
      active: false,
      isHide: false,
      isFocus: false,
      multiple: false
    }
  },
  computed: {
    cls () {
      const cls = []
      if (this.multiple) {
        cls.push('au-option-multiple')
      }
      if (this.active) {
        cls.push('active')
      }

      if (this.isFocus) {
        cls.push('au-focus')
      }
      return cls
    }
  },
  created () {
    this.dispatch('register.option', this)
  },
  beforeDestroy () {
    this.dispatch('unregister.option', this)
  },
  methods: {
    getLabel () {

    },
    clickHandler () {
      this.dispatch(
        this.active
        ? 'unselect.option'
        : 'select.option',
        this.value, this)
    },
    mouseoverHandler () {
      this.dispatch('focus.option', this)
      this.isFocus = true
    },
    mouseoutHandler () {
      this.dispatch('blur.option', this)
      this.isFocus = false
    },
    setActive (isActive, select) {
      this.multiple = select.multiple
      this.active = isActive
    },
    setFocus (isFocus) {
      this.isFocus = isFocus
    }
  }
})

Vue.component('au-option', AuOption)

export default AuOption
