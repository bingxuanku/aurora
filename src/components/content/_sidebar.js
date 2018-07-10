import dispatch from '../../mixins/_dispatch'

const AuSidebar = Vue.extend({
  template: require('./_sidebar.jade'),
  mixins: [dispatch],
  mounted () {
    this.dispatch('show.sidebar')
  },
  beforeDestroy () {
    this.dispatch('hide.sidebar')
  }
})

export default AuSidebar
