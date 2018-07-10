import Menu from '../menu/_menu.js'

const AuHeader = Vue.extend({
  template: require('./_header.jade'),
  props: {}
})

Vue.component('au-header', AuHeader)

export default AuHeader
