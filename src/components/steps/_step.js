
const AuStep = Vue.extend({
  template: require('./_step.jade'),
  props: {
    title: String,
    desc: String,
    icon: String
  },
  data () {
    return {
      index: null
    }
  },
  computed: {
    dot () {
      return this.$parent.dot
    },
    number () {
      return this.index != null ? String(this.index + 1) : ''
    },
    active () {
      return parseInt(this.$parent.activeIndex, 10) > this.index
    },
    current () {
      return parseInt(this.$parent.activeIndex, 10) === this.index
    },
    cls () {
      const cls = []
      if (this.active) {
        cls.push('au-step-active')
      }
      if (this.current) {
        cls.push('au-step-current')
      }
      return cls
    }
  },
  mounted () {
    this.$on('update.index', this.updateIndex)
    this.updateIndex()
  },
  methods: {
    getIndex () {
      return this.$parent.getIndex(this)
    },
    updateIndex () {
      this.index = this.getIndex()
    }
  }
})

Vue.component('au-step', AuStep)

export default AuStep
