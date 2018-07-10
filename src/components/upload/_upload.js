const AuUpload = Vue.extend({
  template: require('./_upload.jade'),
  props: {
    buttonText: {
      type: String,
      default: `选择文件`
    },
    buttonSize: {
      type: String,
      default: 'default'
    },
    buttonIcon: {
      type: String,
      default: 'upload'
    },
    accept: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      fileName: ''
    }
  },
  methods: {
    clear () {
      this.$refs.file.value = ''
      this.fileName = ''
    },
    buttonClickHandler () {
      this.$refs.file.click()
    },
    fileChangeHandler ($event) {
      const files = $event.target.files
      if (files.length > 0) {
        this.fileName = files[0].name
      } else {
        this.fileName = ''
      }

      this.$emit('change', $event)
    }
  }
})

Vue.component('au-upload', AuUpload)

export default AuUpload
