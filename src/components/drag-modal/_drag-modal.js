const modals = []
var firstZIndex = 7000

function addModal (modal) {
  modals.push(modal)
  resetModals()
}

function removeModal (modal) {
  const pos = modals.indexOf(modal)
  if (pos > -1) {
    modals.splice(pos, 1)
  }
  resetModals()
}

function activeModal (modal) {
  removeModal(modal)
  addModal(modal)
}

function resetModals () {
  var zIndex = firstZIndex
  modals.forEach((modal) => {
    modal.zIndex = zIndex++
  })
}

const AuDragModal = Vue.extend({
  template: require('./_drag-modal.jade'),
  props: {
    title: String,
    icon: String,
    value: Boolean,
    top: [Number, String],
    left: [Number, String],
    noClose: Boolean
  },
  data () {
    return {
      zIndex: firstZIndex,
      isMoving: false,
      originPoints: null,
      clickPoints: null,
      isDragged: false,
      selfTop: this.top,
      selfLeft: this.left,
    }
  },
  computed: {
    style () {
      return {
        'z-index': this.zIndex
      }
    }
  },
  mounted () {
    window.addEventListener('mousedown', this.onMousedown, true)
    window.addEventListener('mouseup', this.onMouseup, true)
    window.addEventListener('mousemove', this.onMousemove, true)
    window.addEventListener('mouseup', this.onWindowMouseUp)
    window.addEventListener('resize', this.reset, true)
    window.addEventListener('scroll', this.reset, true)

    if (this.top || this.left) {
      this.setCustomPosition()
    }

    document.body.appendChild(this.$el)
  },
  beforeDestroy () {
    window.removeEventListener('mousedown', this.onMousedown)
    window.removeEventListener('mouseup', this.onMouseup)
    window.removeEventListener('mousemove', this.onMousemove)
    window.removeEventListener('mouseup', this.onWindowMouseUp)
    window.removeEventListener('resize', this.reset)
    window.removeEventListener('scroll', this.reset)

    this.$el.parentElement.removeChild(this.$el)

    removeModal(this)
  },
  methods: {
    reset () {
      this.setLeft(
        this.getBoundLeft(this.getLeft())
      )
      this.setTop(
        this.getBoundTop(this.getTop())
      )
    },
    setCustomPosition () {
      this.setTop(this.top)
      this.setLeft(this.left)
    },
    isMoveableElem (elem) {
      const heading = this.$el.querySelector('.au-modal-heading')
      do {
        if (elem === heading) {
          return true
        }
      } while (elem = elem.parentElement)

      return false
    },
    closeHandler () {
      this.$emit('input', false)
    },
    onMousedownModal () {
      activeModal(this)
    },
    onWindowMouseUp ($event) {
      const target = $event.relatedTarget || $event.toElement
      if (!target || target.nodeName === 'HTML') {
        this.onMouseup()
      }
    },
    onMousedown ($event) {
      if (!this.isMoveableElem($event.target)) {
        return
      }
      const style = window.getComputedStyle(this.$el)

      this.originPoints = {
        x: parseInt(style.left, 10),
        y: parseInt(style.top, 10)
      }

      this.clickPoints = {
        x: $event.pageX,
        y: $event.pageY
      }
      this.isMoving = true
      document.body.classList.add('au-drag-modal-dragging')
    },
    onMouseup ($event) {
      this.originPoints = null
      this.isMoving = false
      document.body.classList.remove('au-drag-modal-dragging')
    },
    onMousemove ($event) {
      if (this.isMoving) {
        $event.preventDefault()
        this.isDragged = true
        this.setTop(this.getBoundTop(($event.pageY - this.clickPoints.y) + this.originPoints.y))
        this.setLeft(this.getBoundLeft(($event.pageX - this.clickPoints.x) + this.originPoints.x))
      }
    },
    getBoundTop (top) {
      const html = document.documentElement
      const rect = this.$el.getBoundingClientRect()
      const bottom = html.scrollHeight - rect.height

      if (top < 0) {
        return 0
      } else if (top > bottom) {
        return bottom
      }
      return top
    },
    getBoundLeft (left) {
      const html = document.documentElement
      const rect = this.$el.getBoundingClientRect()
      const right = html.scrollWidth - rect.width

      if (left < 0) {
        return 0
      } else if (left > right) {
        return right
      }
      return left
    },
    setPosition () {
      if (this.top || this.left) {
        return
      }
      var modal
      var i = modals.length - 1

      const html = document.documentElement
      const rect = this.$el.getBoundingClientRect()

      this.setTop(this.getBoundTop((html.scrollHeight - rect.height) / 2))
      this.setLeft(this.getBoundLeft((html.scrollWidth - rect.width) / 2))
    },
    setTop (top) {
      this.$el.style.top = top + 'px'
    },
    setLeft (left) {
      this.$el.style.left = left + 'px'
    },
    getTop () {
      return parseFloat(this.$el.style.top)
    },
    getLeft () {
      return parseFloat(this.$el.style.left)
    }
  },
  updated () {
    if (this.value) {
      const style = this.$el.style
      const html = document.documentElement
      const maxWidth = html.scrollWidth
      const maxHeight = html.scrollHeight
      style.maxWidth = maxWidth + 'px'
      style.maxHeight = maxHeight + 'px'
    }
  },
  watch: {
    value (value) {
      if (value) {
        this.$nextTick(() => {
          this.setPosition()
          addModal(this)
        })
      } else {
        removeModal(this)
      }
    },
    top () {
      this.setCustomPosition()
    },
    left () {
      this.setCustomPosition()
    }
  }
})

Vue.component('au-drag-modal', AuDragModal)

export default AuDragModal
