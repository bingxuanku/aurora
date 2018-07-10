const AuTag = Vue.extend({
  template: require('./_tag.jade'),
  props: {
    color: {
      type: String,
      default: ''
    },
    bordered: Boolean,
    closeable: Boolean
  },
  computed: {
    cls () {
      const cls = []
      if (this.color) {
        cls.push(`au-tag-${this.color}`)
      }

      if (this.bordered) {
        cls.push('au-tag-bordered')
      }
      return cls
    }
  },
  methods: {
    onClick () {
      this.$emit('close')
    }
  }
})

Vue.component('au-tag', AuTag)

export default AuTag
