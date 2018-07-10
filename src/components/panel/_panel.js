
const transitions = {
  'transition': 'transitionend',
  'OTransition': 'oTransitionEnd',
  'MozTransition': 'transitionend',
  'WebkitTransition': 'webkitTransitionEnd'
}

function addTranstionEndEvent (elem, callback) {
  var event
  for (let key in transitions) {
    if (elem.style[key] !== undefined) {
      event = transitions[key]
    }
  }
  if (!event) {
    return
  }

  const func = function() {
    callback()
    elem.removeEventListener(event, func)
  }
  elem.addEventListener(event, func)
}

const AuPanel = Vue.extend({
  template: require('./_panel.jade'),
  props: {
    title: String,
    icon: String,
    collapse: Boolean,
    value: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      model: this.value,
      contentStyle: {
        height: 'auto'
      }
    }
  },
  mounted () {
    const content = this.$el.querySelector('.au-panel-content')
    if (!this.model) {
      this.contentStyle.height = '0'
    }
  },
  methods: {
    onCollapseChange () {
      this.model = !this.model
      this.model ? this.showContent() : this.hideContent()
      this.$emit('input', this.model)
    },
    showContent () {
      const content = this.$el.querySelector('.au-panel-content')
      const inner = this.$el.querySelector('.au-panel-content-inner')
      clearTimeout(this.timer)

      addTranstionEndEvent(content, () => {
        content.style.height = ''
      })
      content.style.height = inner.clientHeight + 'px'
    },
    hideContent () {
      const content = this.$el.querySelector('.au-panel-content')
      const inner = this.$el.querySelector('.au-panel-content-inner')
      clearTimeout(this.timer)

      this.$set(this.contentStyle, 'height', inner.clientHeight + 'px')
      this.timer = setTimeout(() => {
        this.contentStyle.height = '0'
      }, 50)
    },
    onTransitionEnd () {
      const content = this.$el.querySelector('.au-panel-content')
    }
  },
  watch: {
    value (value) {
      this.model = value
    }
  }
})

Vue.component('au-panel', AuPanel)

export default AuPanel
