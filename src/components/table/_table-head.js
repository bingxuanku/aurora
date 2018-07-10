const AuTableHead = Vue.extend({
  props: {
    model: Object,
    fixedType: String
  },
  render (h) {
    if (!this.model) {
      return null
    }

    const heads = this.model.columns.map((column) => {
      const title = column.getTitle(h, this)
      const options = {}

      if (this.fixedType && this.fixedType === column.fixedType) {
        options.class = 'au-table-fixed-cell'
      }
      return h('th', options, [title])
    })

    const table = h('table', [
      this.model.getColVNodes(h),
      h('thead', [h('tr', heads)])
    ])

    return h('div', {
      'class': 'au-table-head'
    }, [h('div', {
      'class': 'au-table-head-inner'
    }, [table])])
  },
  watch: {
    'model.tableScrollLeft' (value) {
      if (!this.fixedType) {
        this.$el.querySelector('.au-table-head-inner').scrollLeft = value
      }
    }
  }
})

export default AuTableHead
