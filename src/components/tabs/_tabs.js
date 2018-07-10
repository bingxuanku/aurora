import dispatch from '../../mixins/_dispatch'
import AuTabPanel from './_tab-panel.js'

const AuTabs = Vue.extend({
  template: require('./_tabs.jade'),
  mixins: [dispatch],
  props: {
    value: [String, Number]
  },
  data () {
    return {
      panels: [],
      fakeValue: ''
    }
  },
  computed: {
    model: {
      get () {
        return this.value || this.fakeValue
      },
      set (value) {
        this.$emit('input', value)
        this.fakeValue = value
      }
    }
  },
  updated () {
    this.calLineStyle()
  },
  created () {
    this.$on('add-tab-panel', (panel) => {
      this.initPanels()
    })

    this.$on('remove-tab-panel', (panel) => {
      const pos = this.panels.indexOf(panel)
      if (pos > -1) {
        this.panels.splice(pos, 1)
      }
    })
  },
  methods: {
    initPanels () {
      this.panels = this.$children.filter((child) => {
        return child instanceof AuTabPanel
      })
      this.setChildrenActive()
      if (!this.model) {
        if (this.panels.length > 0) {
          this.model = this.panels[0].value
        }
      }
    },
    clickTab (tab) {
      if (!tab.disabled) {
        this.model = tab.value
        this.$emit('tab-click', tab)
      }
    },
    setChildrenActive () {
      this.panels.forEach((panel) => {
        panel.active = panel.value === this.model
      })
    },
    calLineStyle () {
      const heading = this.$el.querySelector('.au-tabs-heading')
      const active = heading.querySelector('.au-tab-item.active')
      const activeLine = this.$refs.activeLine

      if (active != null) {
        activeLine.style.width = active.offsetWidth + 'px'
        activeLine.style.left = active.offsetLeft + 'px'
      } else {
        activeLine.style.width = ''
        activeLine.style.left = ''
      }
    }
  },
  watch: {
    model () {
      this.setChildrenActive()
    }
  }
})

Vue.component('au-tabs', AuTabs)

export default AuTabs
