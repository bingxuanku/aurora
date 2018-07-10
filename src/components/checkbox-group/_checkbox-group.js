const AuCheckboxGroup = Vue.extend({
  template: require('./_checkbox-group.jade'),
  props: {
    options: Array,
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
})

Vue.component('au-checkbox-group', AuCheckboxGroup)

export default AuCheckboxGroup
