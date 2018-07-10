const AuAlert = Vue.extend({
  template: require('./_alert.jade'),
  props: {
    title: String,
    desc: String,
    type: {
      type: String,
      required: true
    },
    showIcon: Boolean,
    closeable: Boolean
  },
  data () {
    return {
      isShow: true
    }
  },
  computed: {
    cls () {
      return `au-alert-${this.type}`
    },
    icon () {
      if (this.showIcon) {
        switch (this.type) {
          case 'success':
            return 'check-circle-o'
          case 'info':
            return 'info-circle'
          case 'warning':
            return 'exclamation-circle'
          case 'danger':
            return 'times-circle-o'
          default:
            return ''
        }
      }
      return ''
    }
  },
  methods: {
    onClose () {
      this.isShow = false
      this.$emit('close')
    }
  }
})

Vue.component('au-alert', AuAlert)

export default AuAlert
