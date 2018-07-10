import Popup from '../popup/_popup.js'

const AuPopConfirm = Vue.extend({
  template: require('./_pop-confirm.jade'),
  components: {
    Popup
  },
  props: {
    message: String,
    confirmMessage: {
      type: String,
      default: `确定`
    },
    cancelmMessage: {
      type: String,
      default: `取消`
    },
    position: {
      type: String,
      default: 'topLeft'
    }
  },
  mounted () {
    this.$refs.popup.setRelateElem(this.$el)
    document.body.appendChild(this.$refs.popup.$el)
  },
  methods: {
    clickHandler ($event) {
      $event.stopPropagation()
      this.$refs.popup.show()
    },
    confirmHandler () {
      this.$refs.popup.hide()
      this.$emit('confirm')
    },
    cancelHandler () {
      this.$refs.popup.hide()
      this.$emit('cancel')
    }
  }
})

Vue.component('au-pop-confirm', AuPopConfirm)

export default AuPopConfirm
