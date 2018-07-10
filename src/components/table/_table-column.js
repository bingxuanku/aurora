import dispatch from '../../mixins/_dispatch'

const AuTableColumn = Vue.extend({
  mixins: [dispatch],
  template: '<div></div>',
  props: {
    label: String,
    attrName: String,
    highlight: Boolean,
    type: String, // '', checkbox
    nowrap: Boolean,
    value: { // for checked rows
      type: Array,
      default: null
    },
    fixed: Boolean,
    width: [String, Number],
    expandRows: Array,
    defaultExpandAll: Boolean,
    sortable: [Boolean, String],
    sortMethod: Function
  },
  data () {
    return {
      fakeValue: [],
      fakeExpandRows: []
    }
  },
  computed: {
    model: {
      get () {
        return this.value || this.fakeValue
      },
      set (value) {
        if (this.value != null) {
          this.$emit('input', value)
        } else {
          this.fakeValue = value
        }
      }
    },
    expandRowsModel: {
      get () {
        return this.expandRows || this.fakeExpandRows
      },
      set (value) {
        if (this.expandRows) {
          this.expandRows.splice(0)
          this.expandRows.push.apply(null, value)
        } else {
          this.fakeExpandRows = value
        }
      }
    }
  },
  mounted () {
    this.$parent.$emit('update.table')
  },
  destroy () {
    this.$parent.$emit('update.table')
  },
  methods: {
    getCheckRowPos (row) {
      return this.model.indexOf(row)
    },
    isCheckedRow (row) {
      return this.getCheckRowPos(row) > -1
    },
    addCheckedRow (row) {
      if (!this.isCheckedRow()) {
        this.model = this.model.concat(row)
      }
    },
    removeCheckedRow (row) {
      const pos = this.getCheckRowPos(row)
      var rows
      if (pos > -1) {
        rows = this.model.slice()
        rows.splice(pos, 1)
        this.model = rows
      }
    },
    toggleCheckedRow (row, isChecked) {
      if (!isChecked) {
        isChecked = !this.isCheckedRow(row)
      }

      if (isChecked) {
        this.addCheckedRow(row)
      } else {
        this.removeCheckedRow(row)
      }
    },
    getCheckedCount () {
      return this.model.length
    }
  }
})


Vue.component('au-table-column', AuTableColumn)

export default AuTableColumn
