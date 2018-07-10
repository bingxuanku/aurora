import AuStep from './_step.js'
import dispatch from '../../mixins/_dispatch.js'

const AuSteps = Vue.extend({
  template: require('./_steps.jade'),
  mixins: [dispatch],
  props: {
    activeIndex: [String, Number],
    dot: Boolean
  },
  data () {
    return {
      lines: []
    }
  },
  computed: {
    cls () {
      const cls = []
      if (this.dot) {
        cls.push('au-steps-dot')
      }
      return cls
    },
    childs () {
      return this.$children.filter((child) => {
        return child instanceof AuStep
      })
    }
  },
  created () {
    window.addEventListener('resize', this.onUpdate)
    window.addEventListener('scroll', this.onUpdate)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onUpdate)
    window.removeEventListener('scroll', this.onUpdate)
  },
  mounted () {
    this.lines = this.getLines()
  },
  updated (...args) {
    const lines = this.getLines()
    if (this.isEqualLine(this.lines, lines)) {
      return
    }
    this.lines = lines
    this.$nextTick(() => {
      this.$forceUpdate()
      this.broadcast('update.index')
    })
  },
  methods: {
    onUpdate () {
      this.lines = this.getLines()
    },
    getChildren () {
      const slots = this.$slots.default
      if (slots == null) {
        return []
      }
      return slots.filter((slot) => {
        return slot.componentInstance && slot.componentInstance instanceof AuStep
      }).map((slot) => {
        return slot.componentInstance
      })
    },
    getIndex (children) {
      return this.getChildren().filter((child) => {
        return child instanceof AuStep
      }).indexOf(children)
    },
    isEqualLine (line1, line2) {
      return JSON.stringify(line1) === JSON.stringify(line2)
    },
    getLines () {
      const lines = []
      const children = this.getChildren()
      const length = children.length
      var index = 0

      while ((index + 1) < length) {
        let left = children[index]
        let right = children[index + 1]

        let leftRect = left.$refs.icon.getBoundingClientRect()
        let rightRect = right.$refs.icon.getBoundingClientRect()
        let elemRect = this.$el.getBoundingClientRect()

        lines.push({
          'class': {
            'au-steps-line-active': this.activeIndex > index
          },
          style: {
            left: (leftRect.left + leftRect.width - elemRect.left) + 'px',
            width: (rightRect.left - leftRect.left - leftRect.width) + 'px'
          }
        })
        index++
      }
      return lines
    }
  }
})

Vue.component('au-steps', AuSteps)

export default AuSteps
