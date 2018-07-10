const AuModalMask = Vue.extend({
  template: require('./_modal-mask.jade'),
  data () {
    return {
      isShow: false,
      zIndex: 0
    }
  },
  computed: {
    style () {
      return {
        'z-index': this.zIndex
      }
    }
  },
  methods: {
    show (zIndex) {
      this.zIndex = zIndex
      this.isShow = true
    },
    hide () {
      this.isShow = false
    }
  }
})

export default AuModalMask
