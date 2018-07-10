import dispatch from '../../mixins/_dispatch'
import Popup from '../popup/_popup.js'
import Option from '../option/_option.js'

const AuSelect = Vue.extend({
  template: require('./_select.jade'),
  mixins: [dispatch],
  components: {
    Popup
  },
  props: {
    options: {
      type: Array,
      default: () => {
        return null
      }
    },
    value: {
      type: [Number, String, Array],
      required: true,
      validator (value) {
        if (this.multiple) {
          return Array.isArray(value)
        }
        return true
      }
    },
    placeholder: {
      type: String,
      default: `请选择`
    },
    multiple: Boolean,
    disabled: Boolean,
    size: {
      type: String,
      default: 'default'
    },
    filter: Boolean,
    clearable: Boolean,
    remote: Boolean,
    remoteMethod: Function
  },
  data () {
    return {
      text: '',
      optionsElem: null,
      registeredChild: {},
      active: false,
      textModel: '',
      focusOption: null,
      interval: null,
      timestamp: new Date()
    }
  },
  computed: {
    showInput () {
      return this.filter && (!this.multiple || !this.disabled)
    },
    selected () {
      this.timestamp

      if (this.multiple) {
        return this.value.map((value) => {
          var label = this.getLabel(value)
          return { label, value }
        })
      } else {
        return [{ label: '', value: this.value }]
      }
    },
    classObj () {
      const classObj = []

      if (this.active) {
        classObj.push('active')
      }

      if (this.disabled) {
        classObj.push('disabled')
      }

      if (this.clearable && !this.isEmptyValue()) {
        classObj.push('au-select-clearable')
      }

      if (this.isEmptyValue()) {
        classObj.push('au-select-placeholder')
      }

      classObj.push(`au-select-${this.size}`)

      return classObj
    }
  },
  created () {
    this.$on('select.option', this.selectValueHandler)
    this.$on('unselect.option', this.unselectValueHandler)

    this.$on('register.option', (child) => {
      this.registeredChild[child._uid] = child
      if (child.value == null) {
        console.error('[AuSelect] option value is ${child.value}')
      }
      this.setOptionActive()
      this.calcText()
      this.timestamp = new Date()
    })

    this.$on('unregister.option', (child) => {
      delete this.registeredChild[child._uid]
      this.setOptionActive()
      this.calcText()
    })

    this.$on('focus.option', (child) => {
      this.clearFocusOption()
      this.focusOption = child
    })

    this.$on('blur.option', (child) => {
      this.clearFocusOption()
      this.focusOption = null
    })
  },
  updated () {
    const text = this.$refs.text
    if (text) {
      if (this.multiple && this.filter) {
        const style = window.getComputedStyle(text)
        if (this.selected.length > 0) {
          let width = Math.max(10, this.getTextWidth(this.textModel, `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`))
          width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 20
          width = Math.min(this.$el.getBoundingClientRect().width - 40, width)
          text.style.width = `${width}px`;
        } else {
          text.style.width = '100%';
        }
      } else {
        text.style.width = '100%';
      }
    }
    this.$nextTick(() => {
      this.$refs.popup.syncWidth()
    })
  },
  mounted () {
    this.$refs.popup.setRelateElem(this.$el, true)
  },
  beforeDestroy () {
    if (this.optionsElem != null) {
      const $el = this.optionsElem.$el
      $el.parentElement.removeChild($el)
    }
  },
  methods: {
    changeValue (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    clearValueHandler ($event) {
      $event.stopPropagation()
      if (this.multiple) {
        this.changeValue([])
      } else {
        this.changeValue('')
      }
    },
    selectValueHandler (value, child) {
      this.addValue(value, child)
      if (!this.multiple) {
        this.hideOptions()
        return
      }

      if (this.filter) {
        this.$refs.text.focus()
      }

      this.$nextTick(() => {
        this.$refs.popup.calPosition()
      })
    },
    unselectValueHandler (value, child) {
      if (!this.multiple) {
        this.hideOptions()
        return
      }
      if (this.filter) {
        this.$refs.text.focus()
      }
      this.removeValue(value)

      this.$nextTick(() => {
        this.$refs.popup.calPosition()
      })
    },
    getLabel (value) {
      var cid, child

      for (cid in this.registeredChild) {
        child = this.registeredChild[cid]
        if (child.value === value) {
          return child.label
        }
      }

      return ''
    },
    calcText () {
      var label = '', child
      if (this.isEmptyValue()) {
        this.text = this.placeholder
      } else {
        for (var key in this.registeredChild) {
          child = this.registeredChild[key]

          if (child.value === this.value) {
            label = child.label
            break
          }
        }
        this.text = label
      }

      if (!this.active && this.filter) {
        if (!this.isEmptyValue()) {
          this.textModel = this.text
        } else {
          this.textModel = ''
        }
      }
    },
    isEmptyValue () {
      return this.multiple ? this.value.length === 0 : this.value === ''
    },
    addValue (value, child) {
      if (this.disabled) {
        return
      }
      if (this.multiple) {
        this.changeValue(this.value.concat(value))
      } else {
        this.changeValue(value)
      }
    },
    removeValue (value) {
      if (this.disabled) {
        return
      }
      const pos = this.value.indexOf(value)
      if (pos > -1) {
        this.value.splice(pos, 1)
      }
      this.changeValue(this.value.slice())
    },
    removeValueHandler ($event, value) {
      $event.stopPropagation()
      this.removeValue(value)
      this.$nextTick(this.$refs.popup.calPosition)
    },
    clickHandler ($event) {
      $event.stopPropagation()
      if (this.disabled) {
        return
      }

      if (this.filter) {
        this.$refs.text.focus()
      } else {
        if (this.active) {
          this.hideOptions()
        } else {
          this.showOptions()
        }
      }
    },
    showOptions () {
      if (this.optionsElem == null) {
        this.optionsElem = this.$refs.popup
        document.body.appendChild(this.optionsElem.$el)
        this.optionsElem.$on('show', () => {
          this.active = true
          this.clearOptions()
        })
        this.optionsElem.$on('hide', () => {
          this.active = false
          this.calcText()
        })
      }
      this.optionsElem.show()
    },
    hideOptions () {
      this.dispatch('blur.form', this.value)

      this.optionsElem.hide()
    },
    setOptionActive () {
      var child
      const value = this.multiple ? this.value : [this.value]
      for (let key in this.registeredChild) {
        child = this.registeredChild[key]
        child.setActive(value.indexOf(child.value) > -1, this)
      }
    },
    keyContinueBind (func) {
      func()
      this.interval = setInterval(func, 400)
    },
    textFocusHandler ($event) {
      $event.stopPropagation()
      this.showOptions()
    },
    keyDownHandler ($event) {
      clearInterval(this.interval)

      switch ($event.key) {
        case 'Backspace':
          if (this.multiple && !this.textModel && this.value.length > 0) {
            this.value.splice(this.value.length - 1, 1)
            this.changeValue(this.value)
            this.$nextTick(this.$refs.popup.calPosition)
          }
          break
        case 'n':
          if (!$event.ctrlKey) {
            break
          }
        case "ArrowDown":
          $event.preventDefault()
          this.keyContinueBind(() => {
            this.getNextFocusOption('down')
          })
          break
        case 'p':
          if (!$event.ctrlKey) {
            break
          }
        case "ArrowUp":
          $event.preventDefault()
          this.keyContinueBind(() => {
            this.getNextFocusOption('up')
          })
          break
      }
    },
    keyUpHandler ($event) {
      clearInterval(this.interval)
      if ($event.ctrlKey || $event.key === 'Control') {
        return
      }

      switch ($event.key) {
        case "ArrowDown":
        case "ArrowUp":
          break
        case "Enter":
          if (this.focusOption) {
            const selected = this.selected.some((item) => { return item.value === this.focusOption.value })
            if (selected) {
              this.unselectValueHandler(this.focusOption.value, this.focusOption)
            } else {
              this.selectValueHandler(this.focusOption.value, this.focusOption)
            }
          }
          if (!this.multiple) {
            this.$refs.text.blur()
          }
          break
        case "Escape":
          this.hideOptions()
          break
        default:
          break
      }
    },
    clearFocusOption () {
      if (this.focusOption) {
        this.focusOption.isFocus = false
        this.focusOption = null
      }
    },
    getNextFocusOption (direction = 'down') {
      const options = this.getOptionInstances(true)
      if (options.length === 0) {
        return
      }

      if (!this.focusOption) {
        if (direction === 'down') {
          this.focusOption = options[0]
        } else {
          this.focusOption = options[options.length - 1]
        }
      } else {
        const index = options.indexOf(this.focusOption)
        this.clearFocusOption()
        if (direction === 'down') {
          this.focusOption = options[index + 1] || options[0]
        } else {
          this.focusOption = options[index - 1] || options[options.length - 1]
        }
      }

      this.focusOption.isFocus = true
    },
    clearOptions () {
      for (let key in this.registeredChild) {
        child = this.registeredChild[key]
        child.isHide = false
      }
      this.clearFocusOption()
    },
    queryOptions () {
      const text = this.textModel.trim()
      if (this.remote && this.remoteMethod) {
        this.remoteMethod(text)
      } else {
        for (let key in this.registeredChild) {
          child = this.registeredChild[key]
          child.isHide = (
            text &&
            child.label.toLowerCase().indexOf(text.toLowerCase()) === -1
          )
        }

        this.clearFocusOption()
        this.getNextFocusOption()
      }

      this.$nextTick(() => {
        if (this.$refs.popup) {
          this.$refs.popup.calPosition()
        }
      })
    },
    getOptionInstances (isShow) {
      $children = this.$refs.popup.$children
      $children = $children.filter((option) => {
        return option instanceof Option && (!isShow || !option.isHide)
      })
      return $children
    },
    getTextWidth (text, font) {
      // re-use canvas object for better performance
      var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
      var context = canvas.getContext("2d");
      context.font = font;
      var metrics = context.measureText(text);
      return metrics.width;
    }
  },
  watch: {
    value () {
      this.setOptionActive()
      this.calcText()
      this.dispatch('change.form', this.value)
    },
    textModel (newValue, oldValue) {
      this.queryOptions()
    }
  }
})

Vue.component('au-select', AuSelect)

export default AuSelect
