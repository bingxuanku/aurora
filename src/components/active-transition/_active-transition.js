const AuActiveTransition = Vue.extend({
  props: {
    during: {
      type: Number,
      default: 100
    },
    disabled: Boolean
  },
  mounted () {
    const transition = (this.during / 1000)
    this.conponent.$on('click', this.clickHandler)
    this.conponent.$el.style.transition = `all ${transition}s`
  },
  beforeDestroy () {
    this.conponent.$off('click', this.clickHandler)
  },
  computed: {
    conponent () {
      return this.$slots.default[0].context
    }
  },
  render (h) {
    return this.$slots.default[0]
  },
  methods: {
    clickHandler () {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }

      if (this.disabled) {
        return
      }

      const $el = this.conponent.$el
      $el.classList.add('active')

      this.timeout = setTimeout(() => {
        $el.classList.remove('active')
        this.timeout = null
      }, this.during)
    }
  }
})

Vue.component('AuActiveTransition', AuActiveTransition)

export default AuActiveTransition
