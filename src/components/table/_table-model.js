class TableColumn {
  constructor (column, tableObj) {
    this.tableObj = tableObj
    this.originColumn = column
    this.title = column.label
    this.prop = column.attrName
    this.originWidth = column.width

    this.fixed = column.fixed
    this.type = column.type
    this.highlight = column.highlight
    this.fixedType = ''
    this.sortable = column.sortable
    this.sortMethod = column.sortMethod
    this.sortName = 'sort'

    if (column.type === 'expand') {
      if (column.defaultExpandAll) {
        this.expandRowsModel = this.tableObj.rows.slice()
      } else {
        this.expandRowsModel = column.expandRowsModel
      }
    }

    this.initWidth()
  }

  initWidth () {
    const column = this.originColumn
    this.width = column.width
    if (!this.width) {
      if (column.type === 'checkbox' || column.type === 'expand') {
        this.originWidth = this.width = this.width || '56'
      } else {
        this.width = '80'
      }
    }
  }

  setAllChecked (column, isChecked) {
    const table = this.tableObj.table
    if (isChecked) {
      column.model = this.tableObj.rows
    } else {
      column.model = []
    }

    table.$nextTick(() => {
      table.$forceUpdate()
      table.$emit('select', column.model)
      table.$emit('select.all', column.model)
    })
  }

  getTitle (h, table) {
    if (this.type === 'expand') {
      return null
    }
    if (this.type === 'checkbox') {
      const column = this.originColumn
      const checkedCount = column.getCheckedCount()
      const length = this.tableObj.rows.length

      return h('div', {'class':'au-table-cell'}, [h('au-checkbox', {
        props: {
          checkedValue: checkedCount === length,
          indeterminate: checkedCount > 0 && checkedCount < length
        },
        on: {
          input: (value) => {
            this.setAllChecked(column, value)
          }
        }
      })])
    }
    const childs = [
      this.title
    ]

    if (this.sortable) {
      childs.push(
        h('au-icon', {
          class: 'au-table-sort-icon',
          props: {
            icon: this.sortName
          }
        })
      )
    }

    return h('div', {
      'class': {
        'au-table-cell': true,
        'au-table-cell-sort': this.sortable
      },
      on: {
        click: () => {
          this.clickHead()
        }
      }
    }, childs)
  }

  clickHead () {
    if (this.sortable) {
      let sortName = this.sortName === 'sort' ? 'sort-desc' : this.sortName === 'sort-desc' ? 'sort-asc' : 'sort'
      this.tableObj.clearSort()
      this.sortName = sortName

      if (this.sortable === true) {
        this.tableObj.updateSortedRows()
      }

      this.tableObj.table.$emit('sort-change', {
        column: this.originColumn,
        prop: this.prop,
        order: sortName === 'sort-desc' ? 'desc' : sortName === 'sort-asc' ? 'asc' : ''
      })
    }
  }

  getCtorContent (data, index) {
    const Ctor = this.originColumn.$scopedSlots.default
    if (!Ctor) {
      return null
    }
    return Ctor({
      data,
      index
    })
  }

  isExpand (data) {
    return this.expandRowsModel.indexOf(data) > -1
  }

  getContent (h, data, index, table) {
    const column = this.originColumn
    const prop = this.prop
    const vdata = column.$vnode.data
    const style = vdata.staticStyle || vdata.style || {}
    var content

    if (column.type === 'checkbox') {
      content = [h('au-checkbox', {
        props: {
          checkedValue: column.isCheckedRow(data)
        },
        on: {
          input: (value) => {
            column.toggleCheckedRow(data, value)
            this.tableObj.table.$nextTick(() => {
              this.tableObj.table.$forceUpdate()
              this.tableObj.table.$emit('select', column.model)
            })
          }
        }
      })]
    } else if (column.type === 'expand') {
      const pos = this.expandRowsModel.indexOf(data)
      content = [
        h(
          'div',
          {
            'class': {
              'au-table-expand-icon': true,
              'active': pos > -1
            },
            on: {
              click: () => {
                var expanded
                if (pos === -1) {
                  expanded = true
                  this.expandRowsModel.push(data)
                } else {
                  expanded = false
                  this.expandRowsModel.splice(pos, 1)
                }
                this.tableObj.table.$emit('expand', expanded, data)
              }
            }
          },
          [h('au-icon', {
            props: {
              icon: 'caret-right'
            }
          })])
      ]
    } else {
      content = this.getCtorContent(data, index) || this.getAttr(data, prop)
    }

    return h('div', {
      'class': 'au-table-cell'
    }, content)
  }

  getAttr (obj, attr) {
    const key = '([\\w\\$]+)'
    const origAttr = attr
    const origObj = JSON.stringify(obj)

    attr = attr.replace(new RegExp('^' + key), (_, value) => {
      try {
        obj = obj[value]
      } catch (e) {
        console.error(`Cannot get value by ${origAttr} in AuTable`, origObj)
        obj = ''
      }
      return ''
    })

    while (attr) {
      let found = false
      attr = attr.replace(new RegExp('^\\.' + key + '|^\\[' + key + '\\]'), (_, value1, value2) => {
        const value = value1 || value2
        try {
          obj = obj[value]
          found = true

        } catch (e) {
          console.error(`Cannot get value by ${origAttr} in AuTable`, origObj)
          obj = ''
        }
        return ''
      })

      if (!found) {
        if (attr) {
          console.error(`cannot match attr-name: ${attr} in AuTable`, origObj)
        }
        break
      }
    }

    return obj
  }
}

export class TableModel {
  constructor (table) {
    this.table = table
    this.rows = table.data
    this.sortedRows = this.rows
    this.initColumns()
    this.updateModel()
    this.showHeader = table.showHeader
    this.tableWidth = null
    this.tableScrollLeft = null
    this.tableScrollTop = null
    this.tableHeadHeight = null
    this.updateSortedRows()
  }

  updateSortedRows () {
    this.columns.some((column) => {
      if (column.sortName !== 'sort') {
        let prop = column.prop
        this.sortedRows = this.rows.slice().sort(
          typeof column.sortMethod === 'function'
          ? (a, b) => {
            let type = column.sortName === 'sort-desc' ? 'desc' : 'asc'
            return column.sortMethod(type, a, b)
          }
          : (a, b) => {
            a = a[prop]
            b = b[prop]

            if (typeof a === 'number') {
              a = String(a)
            }
            if (typeof b === 'number') {
              b = String(b)
            }

            if (typeof a === 'string' && typeof b === 'string') {
              let result = a > b ? 1 : a === b ? 0 : -1
              if (column.sortName === 'sort-desc') {
                result = -1 * result
              }
              return result
            }

            return 0
          }
        )
        return true
      }
      return false
    }) || (this.sortedRows = this.rows)
  }

  clearSort () {
    this.columns.forEach((column) => {
      column.sortName = 'sort'
    })
  }

  updateModel () {
    this.timestamp = new Date()
  }

  initColumns () {
    const columns = this.table.columns
    this.columns = columns.map((column) => {
      return new TableColumn(column, this)
    })
    this.initLeftFixedColumns()
    this.initRightFixedColumns()
  }

  initLeftFixedColumns () {
    this.leftColumns = []
    const continuous = true
    var length = this.columns.length
    const fixed = []

    for (let i = 0; i < length; i++) {
      let column = this.columns[i]
      if (column.fixed) {
        column.fixedType = 'left'
        this.leftColumns.push(column)
      } else {
        break
      }
    }
  }

  initRightFixedColumns () {
    this.rightColumns = []
    const continuous = true
    var length = this.columns.length
    const fixed = []

    for (let i = length - 1; i >= 0; i--) {
      let column = this.columns[i]
      if (column.fixed) {
        column.fixedType = 'right'
        this.rightColumns.push(column)
      } else {
        break
      }
    }
  }

  getColVNodes (h) {
    const cols = this.columns.map((column) => {
      const width = column.width
      const options = {}

      if (width) {
        options.attrs = {
          width
        }
      }
      return h('col', options)
    })

    return h('colgroup', cols)
  }

  initColumnsWidth () {
    this.columns.forEach((column) => {
      column.initWidth()
    })
  }

  updateColumnsWidth () {
    var tableWidth = this.tableWidth
    const noWidthColumns = []
    this.columns.forEach((column) => {
      if (!column.originWidth) {
        noWidthColumns.push(column)
      } else {
        tableWidth -= parseFloat(column.originWidth)
      }
    })

    if (noWidthColumns.length > 0) {
      tableWidth = Math.max(tableWidth / noWidthColumns.length, 80)
      noWidthColumns.forEach((column) => {
        column.width = String(tableWidth)
      })
    }
  }
}

Object.defineProperty(TableModel.prototype, 'minWidth', {
  get: function() {
    return this.columns.reduce((sum, column) => {
      return sum + (column.width)
    }, 0);
  },
  set: function(newValue) {

  },
  enumerable: true,
  configurable: true
});
