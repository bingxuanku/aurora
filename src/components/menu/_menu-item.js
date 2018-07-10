const TIMEOUT = 200

import dispatch from '../../mixins/_dispatch.js'
import Popup, { hideShowingPopup } from '../popup/_popup.js'
import Menu from './_menu.js'

const AuMenuItem = Vue.extend({
  template: require('./_menu-item.jade'),
  mixins: [dispatch],
  props: {
    href: String,
    target: {
      type: String,
      default: '_self'
    },
    icon: String,
    value: String
  },
  data () {
    return {
      subMenu: null,
      popup: null,
      isShowSubMenu: false,
      isActive: false,
      contentStyle: {},
      timeout: null
    }
  },
  computed: {
    cls () {
      const cls = []
      if (this.isShowSubMenu) {
        cls.push('au-menu-item-show-sub-menu')
      }

      if ((!this.$parent.isVertical || this.subMenu == null) && this.isActive) {
        cls.push('au-menu-item-active')
      }
      return cls
    }
  },
  mounted () {
    const trigger = this.$parent.menuTrigger
    this.$children.forEach((item) => {
      if (item instanceof Menu) {
        item.isVertical = this.$parent.isVertical
        item.isSubMenu = true
        this.subMenu = item

        this.$nextTick(() => {
          if (item.isVertical) {
            this.$refs.content.appendChild(item.$el)
          } else {
            item.isPopupMenu = true
            this.popup = new Popup()
            this.popup.$mount(document.createElement('div'))
            this.popup.setRelateElem(this.$el)
            this.popup.getContentElem().appendChild(item.$el)
            this.popup.setDropdown(this, trigger === 'hover')
            document.body.appendChild(this.popup.$el)

            this.subMenu.$on('click.item', () => {
              this.hideSubMenu()
            })

            this.popup.$on('show', () => {
              this.isShowSubMenu = true
            })

            this.popup.$on('hide', () => {
              this.isShowSubMenu = false
            })
          }
        })

        if (trigger === 'hover') {
          this.$refs.title.addEventListener('mouseover', this.onMouseover, true)
          this.$refs.title.addEventListener('mouseout', this.onMouseout)
        }
      }
    })

    this.$refs.title.addEventListener('click', this.onClick, true)
  },
  created () {
    this.$on('check.selected', (selected) => {
      if (this.subMenu != null) {
        this.isActive = false
      } else {
        if (selected.indexOf(this.value) > -1) {
          this.isActive = true
          this.dispatch('add.selected')
        } else {
          this.isActive = false
        }
      }
    })

    this.$on('add.selected', () => {
      this.isActive = true
      if (this.$parent.isVertical && this.subMenu && !this.isShowSubMenu) {
        this.showSubMenu(true)
      }
    })
  },
  beforeDestroy () {
    this.$refs.title.removeEventListener('click', this.onClick, true)
    this.$refs.title.removeEventListener('mouseover', this.onMouseover, true)
    this.$refs.title.removeEventListener('mouseout', this.onMouseout)
  },
  methods: {
    onMouseover () {
      this.showSubMenu(true)
    },
    onMouseout () {
      this.hideSubMenu()
    },
    onClick ($event) {
      $event.stopPropagation()
      // hideShowingPopup()

      if (this.subMenu != null) {
        if (this.isShowSubMenu) {
          this.hideSubMenu(true)
        } else {
          this.showSubMenu(true)
        }
      }

      if (this.href) {
        window.open(this.href, this.target);
      }

      this.$parent.$emit('click.item', this)
      this.$emit('click', $event)
    },
    showSubMenu (immediately) {
      this.clear()
      if (!this.subMenu || this.isShowSubMenu) {
        return
      }
      this.timeout = setTimeout(() => {
        if (this.$parent.isVertical) {
          this.isShowSubMenu = true
          this.contentStyle = { display: 'block', height: '0px' }
          this.$nextTick(() => {
            const height = this.subMenu.$el.offsetHeight
            this.contentStyle = { height: height + 'px' }
          })
        } else {
          this.popup.show()
          this.popup.syncWidth()
        }
      }, immediately ? 0 : TIMEOUT)
    },
    hideSubMenu (immediately) {
      this.clear()

      if (!this.subMenu || !this.isShowSubMenu) {
        return
      }

      this.timeout = setTimeout(() => {
        if (this.$parent.isVertical) {
          this.isShowSubMenu = false
          this.contentStyle = { height: '0px' }
          this.$nextTick(() => {
            setTimeout(() => {
              this.contentStyle.display = 'hidden'
            }, 300)
          })
        } else {
          this.popup.hide()
        }
      }, immediately ? 0 : TIMEOUT)
    },
    show () {
      this.showSubMenu()
    },
    hide () {
      this.hideSubMenu()
    },
    clear () {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
})

Vue.component('au-menu-item', AuMenuItem)

export default AuMenuItem
