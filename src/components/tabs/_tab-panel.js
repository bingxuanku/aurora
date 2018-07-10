import dispatch from '../../mixins/_dispatch'
const AuTabPanel = Vue.extend({
  template: require('./_tab-panel.jade'),
  mixins: [dispatch],
  props: {
    value: [String, Number],
    tab: [String],
    badge: [String, Number],
    disabled: Boolean
  },
  data () {
    return {
      active: false
    }
  },
  mounted () {
    this.dispatch('add-tab-panel', this)
  },
  beforeDestroy () {
    this.dispatch('remove-tab-panel', this)
  },
  watch: {
    active () {
      if (this.active) {
        this.broadcast('tab-panel-show')
      } else {
        this.broadcast('tab-panel-hide')
      }
    }
  }
})


Vue.component('au-tab-panel', AuTabPanel)

export default AuTabPanel
