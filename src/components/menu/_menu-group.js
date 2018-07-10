const AuMenuGroup = Vue.extend({
  template: require('./_menu-group.jade'),
  props: {
    title: String
  }
})

Vue.component('au-menu-group', AuMenuGroup)

export default AuMenuGroup
