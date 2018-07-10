import {hx, inArray, idxArray} from '../../utils/_tools.js'
import instance from '../../utils/_instance.js'

var getParent = instance.getParent

var AuTransferItem = Vue.extend({
  props: {
    checkeds: {
      type: Array,
      default: function (){
        return []
      }
    },
    data: {
      type: Array,
      default: function (){
        return []
      }
    },
    dir: String
  },
  data: function (){
    return {
      query: ''
    }
  },
  computed: {
    transfer: function (){
      return getParent(this, AuTransfer)
    },
    dataKey: function (){
      return this.transfer.dataKey
    }
  },
  methods: {
    getAllCheckedStatus: function (){
      var status = -1 // -1没有选中，0有部分选中，1全部选中，2除了disabled全部选中
      var disabledNum = 0

      this.data.forEach(_=>{
        if (_['disabled']){
          disabledNum ++
        }
      })

      if (this.checkeds.length === 0){
        return -1
      }

      if (this.checkeds.length > 0 && this.checkeds.length === this.data.length){
        return 1
      }

      if (this.checkeds.length + disabledNum === this.data.length){
        return 2
      }

      return 0

    },
    getFilterData: function (){
      return this.data.filter(data=>{
        if (this.transfer.filterFunc){
          return this.transfer.filterFunc(this.query, data)
        }

        var showLabel = me.transfer.renderFunc ? me.transfer.renderFunc(data) : data.label

        if (showLabel.indexOf(this.query) !== -1){
          return true
        }
        return false
      })
    }
  },
  render: function (h){
    console.log('transferItem render', this.dir)
    var me = this

    var allCheckedStatus = this.getAllCheckedStatus()

    var filterData = this.getFilterData()

    // get items
    var $items = filterData.map(data=>{
      return hx('div.au-transfer-panel__item')
        .push(
          hx('au-checkbox', {
            props:{
              'label': me.transfer.renderFunc ? me.transfer.renderFunc(data) : data.label, 
              checkedValue: inArray(data[this.dataKey], this.checkeds),
              disabled: data.disabled ? true : false
            },
            on: {
              input: function (value){
                me.transfer.updateLeftRightCheckeds(me.dir, data[me.dataKey], value)
              }
            }
          })
        )
    })

    return hx('div.au-transfer-panel')
    .push(
      hx('div.au-transfer-panel__header', {
        domProps: {
          'innerHTML': this.dir === 'left' ? this.transfer.titles[0] : this.transfer.titles[1]
        }
      })
    )
    .push(
      hx('div.au-transfer-panel__body')
      .push(
        me.transfer.filterable ? hx('div.au-transfer-panel__filter')
        .push(
          hx('au-input', {
            props: {
              size: 'mini',
              icon: me.query.length > 0 ? 'close' : 'search',
              value: me.query,
              placeholder: me.transfer.filterPlaceholder
            },
            on: {
              input: function (val){
                me.query = val
              },
              'click-icon': function (){
                me.query = ''
              }
            }
          })
        ) : null
      )
      .push(
        hx('div.au-transfer-panel__list')
        .push(
          $items
        )
        .push(
          hx('p.au-transfer-panel__empty', {
            style: {
              display: $items.length === 0 ? 'block': 'none'
            }
          }, ['无数据'])
        )
      )
    )
    .push(
      hx('div.au-transfer-panel__footer')
      .push(
        hx('au-checkbox', {
          props:{
            label: `${me.checkeds.length}/${me.data.length}`,
            checkedValue: allCheckedStatus === 1,
            indeterminate: allCheckedStatus === 0 || allCheckedStatus === 2
          },
          on: {
            input: function (value){
              if (allCheckedStatus === 2){
                value = false
              }
              me.transfer.updateLeftRightAllCheckeds(me.dir, value, filterData)
            }
          }
        })
      )
    )
    .resolve(h)
  }
})

export default AuTransfer = Vue.extend({
  model: {
    prop: 'checkeds',
    event: 'change'
  },
  props: {
    checkeds: {
      type: Array,
      default: function (){
        return []
      }
    },
    data: {
      type: Array,
      default: function (){
        return []
      }
    },
    leftDefaultCheckeds: {
      type: Array,
      default: function (){
        return []
      }
    },
    rightDefaultCheckeds: {
      type: Array,
      default: function (){
        return []
      }
    },
    dataKey: {
      type: String,
      default: 'id'
    },
    buttonTexts: {
      type: Array,
      default: function (){
        return ['到左边', '到右边']
      }
    },
    titles: {
      type: Array,
      default: function (){
        return ['列表1', '列表2']
      }
    },
    renderFunc: Function,
    filterFunc: Function,
    filterable: Boolean,
    filterPlaceholder: {
      type: String,
      default: '请输入搜索内容'
    }
  },
  data: function (){
    return {
      leftCheckeds: [],
      rightCheckeds: [],
    }
  },
  created: function (){
    this.addLeftDefaultCheckeds()
    this.addRightDefaultCheckeds()
  },
  watch: {
    leftDefaultCheckeds: function (){
      this.addLeftDefaultCheckeds()
    },
    rightDefaultCheckeds: function (){
      this.addRightDefaultCheckeds()
    }
  },
  methods: {
    addLeftDefaultCheckeds: function (){
      this.leftCheckeds.push(...this.leftDefaultCheckeds)
    },
    addRightDefaultCheckeds: function (){
      this.rightCheckeds.push(...this.rightDefaultCheckeds)
    },
    getLeftRightItems: function (){
      var data = [...this.data]
      var left = []
      var right = []

      data.forEach(_=>{
        if (inArray(_[this.dataKey], this.checkeds)){
          right.push(_)
        }
        else {
          left.push(_)
        }
      })

      return [left, right]
    },
    updateLeftRightCheckeds: function (dir, key, isChecked){
      var leftRightCheckeds = dir === 'left' ? this.leftCheckeds : this.rightCheckeds
      var idx = leftRightCheckeds.indexOf(key)

      if (isChecked){
        if (idx === -1){
          leftRightCheckeds.push(key)
        }
      }
      else {
        if (idx !== -1){
          leftRightCheckeds.splice(idx, 1)
        }
      }
    },
    updateLeftRightAllCheckeds: function (dir, isChecked, filterData){
      var isLeft = dir === 'left'
      var checkeds = []

      if (isChecked){
        filterData.forEach(_=>{
          if (!_.disabled){
            checkeds.push(_[this.dataKey])
          }
        })
      }

      this[isLeft ? 'leftCheckeds' : 'rightCheckeds'] = checkeds
    },
    updateLeftRightItems: function (dir){
      var me = this

      var checkeds = [...this.checkeds]
      var moveCheckeds = []

      if (dir === 'left'){
        moveCheckeds = [...this.rightCheckeds]
        this.rightCheckeds.forEach(_=>{
          var idx = checkeds.indexOf(_)
          if (idx !== -1){
            checkeds.splice(idx, 1)
          }
        })
        this.rightCheckeds = []
      }
      else {
        moveCheckeds = [...this.leftCheckeds]
        checkeds.push(...this.leftCheckeds)
        this.leftCheckeds = []
      }

      this.$emit('change', checkeds, dir, moveCheckeds)
    },

    clearLeftCheckeds: function (){
      this.leftCheckeds = []
    },
    clearRightCheckeds: function (){
      this.rightCheckeds = []
    }
      
  },
  render: function (h){
    console.log('transfer render')
    var me = this

    var [leftItems, rightItems] = this.getLeftRightItems()

    return hx('div.au-transfer')
    .push(
      hx('au-flex', {props:{gutter:10,alignItems:''}})

      // left transfer item
      .push(
        hx('au-item', {props:{span:10}})
        .push(
          hx('au-transfer-item', {
            props:{data:leftItems, checkeds:this.leftCheckeds, dir:'left'}}
          )
        )
      )

      // buttons
      .push(
        hx('au-item', {props:{span:4}})
        .push(
          hx('div.au-transfer__buttons')
          .push(
            hx('au-button', {
              props:{
                icon: 'chevron-left',
                size: 'small',
                type: me.rightCheckeds.length === 0 ? 'default' : 'primay', 
                block: true, 
                disabled: me.rightCheckeds.length === 0
              },
              on: {
                click: function (){
                  me.updateLeftRightItems('left')
                }
              }
            }, [me.buttonTexts[0]])
          )
          .push(
            hx('au-button', {
              props:{
                icon: 'chevron-right',
                size: 'small',
                type: me.leftCheckeds.length === 0 ? 'default' : 'primay', 
                block: true,
                disabled: me.leftCheckeds.length === 0
              },
              on: {
                click: function (){
                  me.updateLeftRightItems('right')
                }
              }
            }, [me.buttonTexts[1]])
          )
        )
      )

      // right transfer item
      .push(
        hx('au-item', {props:{span:10}})
        .push(
          hx('au-transfer-item', {
            props:{data:rightItems, checkeds:this.rightCheckeds, dir:'right'}}
          )
        )
      )
    )
    .resolve(h)
  }
})

Vue.component('au-transfer-item', AuTransferItem)
Vue.component('au-transfer', AuTransfer)