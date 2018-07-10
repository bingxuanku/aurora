const AuApp = Vue.extend({
  template: require('./_app.jade'),
  props: {},
  data () {
    return {
      hasSidebar: false
    }
  },
  created () {
    this.$on('show.sidebar', () => {
      this.hasSidebar = true
    })
    this.$on('hide.sidebar', () => {
      this.hasSidebar = false
    })
  }
})

Vue.component('au-app', AuApp)

export default AuApp
