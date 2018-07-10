import AuHeader from '../header/_header.js'
import AuSidebar from '../content/_sidebar.js'
import dispatch from '../../mixins/_dispatch.js'

const AuMenu = Vue.extend({
  template: require('./_menu.jade'),
  mixins: [dispatch],
  props: {
    menuTrigger: {
      type: String,
      default: 'click'
    },
    vertical: Boolean,
    selected: [Array, String]
  },
  computed: {
    currentSelected () {
      return Array.isArray(this.selected) ? this.selected : this.selected ? [this.selected] : []
    },
    classObj () {
      const classObj = []

      if (this.isPopupMenu) {
        classObj.push('au-menu-popup-menu')
      } else {
        if (this.isVertical) {
          classObj.push('au-menu-vertical')
        } else {
          classObj.push('au-menu-horizontal')
        }
      }

      if (this.isSubMenu) {
        classObj.push('au-menu-sub-menu')
      }
      return classObj
    }
  },
  data () {
    return {
      isSubMenu: false,
      isVertical: this.vertical,
      isPopupMenu: false
    }
  },
  beforeMount () {
    if (!this.$options.propsData.vertical) {
      if (this.getParent(AuHeader) != null) {
        this.isVertical = false
      } else if (this.getParent(AuSidebar) != null) {
        this.isVertical = true
      }
    }
  },
  mounted () {
    if (this.currentSelected.length > 0) {
      this.checkSelected()
    }
  },
  methods: {
    getParent (Ctor) {
      var elem = this.$parent
      do {
        if (elem && elem instanceof Ctor) {
          return elem
        }
      } while (elem = elem.$parent)

      return null
    },
    checkSelected () {
      this.broadcast('check.selected', this.currentSelected)
    }
  },
  watch: {
    vertical (vertical) {
      this.isVertical = vertical
    },
    currentSelected () {
      this.checkSelected()
    }
  }
})

Vue.component('au-menu', AuMenu)

export default AuMenu
