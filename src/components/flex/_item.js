const ROW_SPANS = 24
const AuItem = Vue.extend({
  template: `<div class="au-item" :class="classObj" :style="styleObj"><slot></slot></div>`,
  props: {
    flex: [Boolean, String, Number],
    order: {
      type: String,
      default: ''
    },
    grow: {
      type: String,
      default: ''
    },
    shrink: {
      type: String,
      default: ''
    },
    basis: {
      type: String,
      default: ''
    },
    alignSelf: {
      type: String,
      default: ''
    },
    span: [String, Number],
    offset: [String, Number]
  },
  computed: {
    classObj () {
      const classObj = []
      const span = parseInt(this.span, 10)
      const offset = parseInt(this.offset, 10)

      if (span > 0 && span <= 24) {
        classObj.push(`au-item-span-${span}`)
      }

      if (offset > 0 && offset <= 24) {
        classObj.push(`au-item-offset-${offset}`)
      }

      return classObj
    },
    styleObj () {
      const style = {}
      const gutter = parseFloat(this.$parent.gutter)

      if (gutter) {
        style['padding'] = (gutter / 2) + 'px'
      }

      if (this.flex === true) {
        style['flex'] = '1'
      } else if (this.flex !== false) {
        style['flex'] = String(this.flex)
      }

      if (this.order) {
        style['order'] = this.order
      }

      if (!this.columnMode && this.grow) {
        style['flex-grow'] = this.grow
      }

      if (this.shrink) {
        style['flex-shrink'] = this.shrink
      }

      if (this.basis) {
        style['flex-basis'] = this.basis
      }

      if (this.alignSelf) {
        style['align-self'] = this.alignSelf
      }

      return style
    }
  }
})

Vue.component('au-item', AuItem)

export default AuItem
