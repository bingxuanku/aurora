import AuRow from './_row.js'

export default AuCol = Vue.extend({
  template: '<div class="au-col" :class="cls" :style="style"><slot></slot></div>',
  props: {
    span: Number,
    offset: Number
  },
  computed: {
    cls () {
      const cls = []
      if (!isNaN(this.span) && this.span > 0 && this.span <= 24) {
        cls.push(`au-col-span-${this.span}`)
      }

      if (!isNaN(this.offset) && this.offset > 0 && this.offset <= 24) {
        cls.push(`au-col-offset-${this.offset}`)
      }
      return cls
    },
    style () {
      const style = {}
      if (this.$parent instanceof AuRow) {
        const gutter = this.$parent.gutter
        if (gutter > 0) {
          gutter = gutter / 2
          style.paddingLeft = style.paddingRight = `${gutter}px`
        }
      }
      return style
    }
  }
})

Vue.component('au-col', AuCol)
