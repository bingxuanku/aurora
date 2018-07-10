
const AuTimePickerItem = Vue.extend({
  template: require('./_time-picker-item.jade'),
  props: {
    value: {
      type: [String, Number]
    },
    range: Array
  },
  data () {
    return {
      lastDatetime: new Date(),
      isDisableEvent: false,
      isAnimate: false,
      clientHeight: 0,
      offsetY: 0,
      timeout: null
    }
  },
  computed: {
    styleObject () {
      this.offsetY
      this.isAnimate

      const style = {
        transform: `translateY(${this.offsetY}px)`
      }

      if (this.isAnimate) {
        style.transition = 'transform 0.35s'
      }
      return style
    }
  },
  created () {
    this.$on('show.popup', () => {
      this.clientHeight = this.$el.querySelector('.au-time-picker-selector-inner').clientHeight - this.$el.clientHeight
      this.resetPosition(true)
    })
  },
  methods: {
    reset () {
      setTimeout(() => {
        this.resetPosition(true)
      }, 64)
    },
    resetPosition (noAnimate) {
      this.isAnimate = !noAnimate
      const active = this.$el.querySelector('.active')
      if (active) {
        this.offsetY = -1 * active.offsetTop
      }
    },
    getAvaiableValue () {
      var firstAvailable, isDisabled = false
      this.range.some((item) => {
        if (!item.isDisabled && !firstAvailable) {
          firstAvailable = item
        }

        if (item.label == this.value) {
          if (item.isDisabled) {
            isDisabled = true
          } else {
            return item.label
          }
        }

        if (isDisabled && firstAvailable) {
          return firstAvailable.label
        }
      })
    },
    clickHandler (value) {
      if (value.isDisabled) {
        return
      }
      this.$emit('input', value.label)
    },
    scrollHandler ($event) {
      $event.preventDefault()
      this.isAnimate = false
      const delta = this.getDeltaFromEvent($event)
      this.offsetY = this.ensureOffsetY(this.offsetY + delta[1])
      //this.afterScroll()
    },
    getCalDeltaY (value) {
      const spill = this.getSpill()

      if (spill) {
        return (1 / (spill * Math.sqrt(spill))) * value
      }

      return value
    },
    getSpill () {
      const value = this.offsetY
      const offset = 0
      if (value > 0) {
        return value
      } else if (value < -this.clientHeight) {
        return this.clientHeight - value
      }
      return 0
    },
    checkValue (value) {
      const offset = 0
      return value <= offset && value >= -this.clientHeight - offset
    },
    afterScroll () {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }

      this.timeout = setTimeout(() => {
        this.isAnimate = true
        this.offsetY = this.ensureOffsetY(this.offsetY)
      }, 1000/60*2)
    },
    ensureOffsetY (value) {
      if (value > 0) {
        return 0
      } else if (value < -this.clientHeight) {
        return -this.clientHeight
      } else {
        return value
      }
    },
    getDeltaFromEvent ($event){
      var deltaX = $event.deltaX;
      var deltaY = -1 * $event.deltaY;

      if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
        // OS X Safari
        deltaX = -1 * $event.wheelDeltaX / 6;
        deltaY = $event.wheelDeltaY / 6;
      }

      if ($event.deltaMode && $event.deltaMode === 1) {
        // Firefox in deltaMode 1: Line scrolling
        deltaX *= 10;
        deltaY *= 10;
      }

      if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
        // IE in some mouse drivers
        deltaX = 0;
        deltaY = $event.wheelDelta;
      }

      if ($event.shiftKey) {
        // reverse axis with shift key
        return [-deltaY, -deltaX];
      }
      return [deltaX, deltaY];
    }

  },
  watch: {
    value () {
      this.$nextTick(this.resetPosition)
    }
  }
})

export default AuTimePickerItem
