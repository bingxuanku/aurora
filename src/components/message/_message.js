
const HIDE_CURING = 3000

const AuMessage = Vue.extend({
  template: require('./_message.jade'),
  data () {
    return {
      type: 'default',
      title: '提示信息',
      message: '',
      timer: null,
      isShow: false,
      isTouching: false,
      options: {}
    }
  },
  computed: {
    cls () {
      const cls = [`au-message-${this.type}`]
      if (!this.title) {
        cls.push('au-message-only-desc')
      }
      return cls
    },
    buttons () {
      return this.options && this.options.buttons || []
    }
  },
  mounted () {
    if (this.type !== 'loading') {
      this.startDisappear()
    }
    this.isShow = true
  },
  methods: {
    onMouseover () {
      this.isTouching = true
      this.clearDisappear()
    },
    onMouseout () {
      this.isTouching = false
      this.startDisappear()
    },
    startDisappear () {
      this.timer = setTimeout(this.disappear, HIDE_CURING)
    },
    clearDisappear () {
      clearTimeout(this.timer)
    },
    disappear () {
      this.clearDisappear()
      this.isShow = false
      this.$nextTick(() => {
        this.$parent.disappearHandler(this)
        this.$destroy(true)
        if (this.$el.parentNode) {
          this.$el.parentNode.removeChild(this.$el);
        }
      })
    }
  }
})

export default AuMessage
