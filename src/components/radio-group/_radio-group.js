const AuRadioGroup = Vue.extend({
  template: require('./_radio-group.jade'),
  props: {
    options: {
      type: Array,
      required: false,
      default: null,
      validator (value) {
        var result = true
        value.forEach((item) => {
          result = result && 'label' in item && 'value' in item
        })
        return result
      }
    },
    value: [String, Number]
  }
})

Vue.component('AuRadioGroup', AuRadioGroup)

export default AuRadioGroup
