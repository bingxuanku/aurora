import {hx, inArray, idxArray} from '../../utils/_tools.js'
import instance from '../../utils/_instance.js'

var getParent = instance.getParent

var AuTimeline = Vue.extend({
  render: function (h){
    var $items = this.$slots.default.filter((vnode, idx)=>{
      return (vnode.componentOptions||{}).tag === 'au-timeline-item'
    })

    // 是否有pending项
    var hasPending = false

    // 如果有au-timeline-item
    var itemsCount = $items.length
    if (itemsCount > 0){
      if (itemsCount === 1){
        $items[0].componentOptions.propsData['isLast'] = true
      }
      else {
        hasPending = 'pending' in $items[itemsCount - 1].componentOptions.propsData
        var $iterItems = hasPending ? $items.slice(0, -1) : $items

        $iterItems.forEach(($item, idx)=>{
          if (idx === $iterItems.length - 1){
            $item.componentOptions.propsData['isLast'] = true
          }
        })
      }
    }
    
    return hx(`ul.au-timeline + ${hasPending ? 'au-timeline-pending' : ''}`)
    .push(
      $items
    )
    .resolve(h)
  }
})

var AuTimelineItem = Vue.extend({
  props: {
    color: {
      type: String,
      default: 'blue'
    },
    isLast: {
      type: Boolean,
      default: false
    },
    icon: String,
    pending: Boolean
  },
  render: function (h){
    // 自定义颜色
    var colorClass = ''
    var colorStyle = {}

    if (inArray(this.color, ['blue', 'green', 'red'])){
      colorClass = `au-timeline-item-head-${this.color}`
    }
    else {
      colorStyle = {
        'border-color': this.color,
        'color': this.color
      }
    }

    // 是否最后项
    var lastClass = this.isLast ? 'au-timeline-item-last' : ''

    //是否pending
    var pendingClass = this.pending ? 'au-timeline-item-pending' : ''

    return hx(`li.au-timeline-item + ${lastClass} + ${pendingClass}`)
    .push(
      hx('div.au-timeline-item-tail')
    )
    .push(
      hx(`div.au-timeline-item-head + ${colorClass} + ${this.icon ? 'au-timeline-item-head-custom' : ''}`, {style:colorStyle})
      .push(
        this.icon ? hx('au-icon', {props:{icon:this.icon}}) : null
      )
    )
    .push(
      hx('div.au-timeline-item-content')
      .push(
        this.$slots.default
      )
    )
    .resolve(h)
  }
})

Vue.component('au-timeline-item', AuTimelineItem)
Vue.component('au-timeline', AuTimeline)