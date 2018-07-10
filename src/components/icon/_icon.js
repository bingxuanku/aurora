Vue.component('au-icon', {
  template: '<i class="au-icon fa" :class="iconObj"></i>',
  props: {
    type: String,
    icon: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: 'default'
    },
    autorotate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconObj () {
      const obj = []
      obj.push('fa-' + this.icon)
      obj.push('au-icon-' + this.icon)
      obj.push('au-icon-' + this.size)

      if (this.type) {
        obj.push('au-icon-' + this.type)
      }

      if (this.autorotate) {
        obj.push('fa-fw fa-spin')
      }

      return obj
    }
  }
})
