import Popup from '../popup/_popup.js'
import Menu from '../menu/_menu.js'

const TIMEOUT = 200

const AuDropdown = Vue.extend({
  template: require('./_dropdown.jade'),
  props: {
    trigger: {
      type: String,
      default: 'hover'
    }
  },
  data () {
    return {
      popup: null,
      timer: null
    }
  },
  mounted () {
    this.$children.some((component) => {
      if (component instanceof Menu) {
        this.menu = component

        this.popup = new Popup()
        this.popup.$mount(document.createElement('div'))
        this.popup.setRelateElem(this.$el.children[0])
        this.popup.getContentElem().appendChild(component.$el)
        this.popup.setDropdown(this, this.trigger === 'hover')
        document.body.appendChild(this.popup.$el)
        component.isPopupMenu = true
        component.$on('click.item', () => {
          this.hide(true)
        })

        if (this.trigger === 'hover') {
          this.$el.addEventListener('mouseover', this.show, true)
          this.$el.addEventListener('mouseout', this.hide)
        } else if (this.trigger === 'click') {
          this.$el.addEventListener('click', this.clickHandler, true)
        }
        return true
      }
    })
  },
  beforeDestroy () {
    if (this.menu) {
      if (this.trigger === 'hover') {
        this.$el.removeEventListener('mouseover', this.show, true)
        this.$el.removeEventListener('mouseout', this.hide)
      } else if (this.trigger === 'click') {
        this.$el.removeEventListener('click', this.clickHandler, true)
      }
    }
  },
  methods: {
    clickHandler () {
      if (this.popup.isShow) {
        this.hide(true)
      } else {
        this.show(true)
      }
    },
    show (immediately) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.popup.show()
        this.timer = null
      }, immediately ? 0 : TIMEOUT)
    },
    hide (immediately) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.popup.hide()
        this.timer = null
      }, immediately ? 0 : TIMEOUT)
    }
  }
})

Vue.component('au-dropdown', AuDropdown)

export default AuDropdown
