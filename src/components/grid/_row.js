export default AuRow = Vue.extend({
  template: '<div class="au-row" :class="cls" :style="style"><slot></slot></div>',
  props: {
    gutter: Number,
    type: String, // 布局方式: flex
    alignItems: {
      type: String,
      default: ''
    },
    justifyContent: {
      type: String,
      default: ''
    }
  },
  computed: {
    cls () {
      const cls = []
      if (this.type === 'flex') {
        cls.push('au-row-flex')
      }
      return cls
    },
    style () {
      const style = {}
      if (this.alignItems) {
        style.alignItems = this.alignItems
      }

      if (this.justifyContent) {
        style.justifyContent = this.justifyContent
      }

      const gutter = this.gutter
      if (gutter > 0) {
        gutter = gutter / 2
        style.marginLeft = style.marginRight = `-${gutter}px`
      }

      return style
    }
  }
})

Vue.component('au-row', AuRow)
