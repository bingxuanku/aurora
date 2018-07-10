const AuTableBody = Vue.extend({
  props: {
    model: Object,
    columns: Array
  },
  render (h) {
    if (!this.model) {
      return null
    }
    const columnLength = this.model.columns.length
    const rows = []
    this.model.sortedRows.forEach((row, index) => {
      var addonRow = null
      const tds = []
      this.model.columns.forEach((column, columnIndex) => {
        if (column.type === 'expand' && addonRow == null && column.isExpand(row)) {
          addonRow = h('tr', [h(
            'td',
            {
              'class': 'au-table-expand-td',
              attrs: {
                colspan: columnLength
              }
            },
            [
              h('div', {'class': 'au-table-cell'}, [column.getCtorContent(row, index)])
            ]
          )])
        }

        const content = column.getContent(h, row, index, this)
        tds.push(h(column.highlight ? 'th' : 'td', [content]))
      })
      rows.push(h('tr', {}, tds))
      if (addonRow) {
        rows.push(addonRow)
      }
    })

    const table = h('table', [
      this.model.getColVNodes(h),
      h('tbody', rows)
    ])

    return h('div', {
      'class': 'au-table-body'
    }, [table])
  }
})

export default AuTableBody
