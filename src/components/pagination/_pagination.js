const AuPagination = Vue.extend({
  template: require('./_pagination.jade'),
  props: {
    align: {
      type: String,
      default: 'left'
    },
    value: {
      type: Number,
      default: 1
    },
    itemCount: {
      type: Number,
      default: 0
    },
    pageSizeOptions: {
      type: Array,
      default () {
        return [10, 20, 50]
      }
    },
    pageSize: {
      type: Number,
      default () {
        return this.pageSizeOptions[0] || 10
      }
    },
    showPageSizeControl: Boolean,
    showPageControl: Boolean,
    showTotal: Boolean
  },
  computed: {
    classObj () {
      const classObj = []
      classObj.push(`au-pagination-${this.align}`)
      return classObj
    },
    pageSizeSelectOptions () {
      return this.pageSizeOptions.map((value) => {
        return {
          value,
          label: `每页 ${value} 条`
        }
      })
    },
    page: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('change', value)
        this.$emit('input', value)
      }
    },
    pageCount () {
      return Math.max(1, Math.ceil(this.itemCount / this.selfPageSize))
    },
    numbers () {
      var page = Math.max(this.page - 2, 1)
      var endPage = Math.min(page + 5, this.pageCount)
      const numbers = []
      while (page <= endPage) {
        numbers.push(page)
        page++
      }
      return numbers
    },
    isShowStartArrow () {
      return this.numbers[0] > 2
    },
    isShowStartPage () {
      return this.numbers[0] > 1
    },
    isShowEndArrow () {
      return this.numbers[this.numbers.length - 1] < (this.pageCount - 1)
    },
    isShowEndPage () {
      return this.numbers[this.numbers.length - 1] < (this.pageCount)
    }
  },
  data () {
    return {
      selfPageSize: this.pageSize,
      displayPage: String(this.value)
    }
  },
  methods: {
    prevFive () {
      this.page = this.getValidPage(this.page - 5)
    },
    nextFive () {
      this.page = this.getValidPage(this.page + 5)
    },
    isRightOut (page) {
      return page >= this.pageCount
    },
    isLeftOut (page) {
      return page <= 1
    },
    prevPage () {
      if (!this.isLeftOut(this.page)) {
        this.page--
      }
    },
    nextPage () {
      if (!this.isRightOut(this.page)) {
        this.page++
      }
    },
    goPage (page) {
      this.page = this.getValidPage(page)
      this.displayPage = String(this.page)
    },
    changePage ($event) {
      const value = parseInt($event.target.value, 10) || 1
      this.goPage(value)
    },
    blurPage ($event) {
      this.displayPage = String(this.page)
    },
    getValidPage (page) {
      if (this.isLeftOut(page)) {
        return 1
      } else if (this.isRightOut(page)) {
        return this.pageCount
      } else {
        return page
      }
    }
  },
  watch: {
    page (value) {
      this.displayPage = String(value)
    },
    pageSize (pageSize) {
      this.selfPageSize = pageSize
    },
    selfPageSize (pageSize) {
      this.page = this.getValidPage(this.page)
      this.$emit('page-size-change', pageSize)
    }
  }
})

Vue.component('au-pagination', AuPagination)

export default AuPagination
