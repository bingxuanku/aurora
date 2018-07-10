import Popup from '../popup/_popup.js'

const TIMEOUT = 100

const AuTooltip = Vue.extend({
  template: require('./_tooltip.jade'),
  components: {
    Popup
  },
  props: {
    message: String,
    position: {
      type: String,
      default: 'top'
    },
    trigger: {
      type: String,
      default: 'hover'
    }
  },
  data () {
    return {
      timer: null
    }
  },
  mounted () {
    this.$refs.popup.setRelateElem(this.$el)
    document.body.appendChild(this.$refs.popup.$el)

    switch (this.trigger) {
      case 'click':
        this.$el.addEventListener('click', this.showPopup)
        break

      case 'hover':
        this.$el.addEventListener('mouseover', this.delayShowPopup)
        this.$el.addEventListener('mouseout', this.delayHidePopup)
        break

      case 'focus':
        this.$el.addEventListener('focus', this.showPopup, true)
        this.$el.addEventListener('blur', this.hidePopup, true)
        break
    }
  },
  methods: {
    delayShowPopup () {
      if (this.timer) {
        clearTimeout(this.timer)
      }

      this.timer = setTimeout(this.showPopup, TIMEOUT)
    },
    delayHidePopup () {
      if (this.timer) {
        clearTimeout(this.timer)
      }

      this.timer = setTimeout(this.hidePopup, TIMEOUT)
    },
    showPopup () {
      this.$refs.popup.show()
    },
    hidePopup () {
      this.$refs.popup.hide()
    }
  }
})

Vue.component('au-tooltip', AuTooltip)

export default AuTooltip
