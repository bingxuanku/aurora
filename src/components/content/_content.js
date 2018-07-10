import Menu from '../menu/_menu.js'
import AuSidebar from './_sidebar.js'

const AuContent = Vue.extend({
  template: require('./_content.jade'),
  components: {
    AuSidebar
  }
})

Vue.component('au-content', AuContent)

export default AuContent
