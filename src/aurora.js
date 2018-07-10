import './sass/aurora.css'

import './components/button/_button.js'
import './components/button-group/_button-group.js'
import './components/icon/_icon.js'
import './components/flex/_flex.js'
import './components/flex/_item.js'
import './components/grid/_row.js'
import './components/grid/_col.js'
import './components/form/_form.js'
import './components/form/_form-group.js'
import './components/form/_form-item.js'
import './components/upload/_upload.js'
import './components/input/_input.js'
import './components/checkbox/_checkbox.js'
import './components/checkbox-group/_checkbox-group.js'
import './components/radio/_radio.js'
import './components/radio-group/_radio-group.js'
import './components/select/_select.js'
import './components/option/_option.js'
import './components/option-group/_option-group.js'
import './components/table/_table.js'
import './components/table/_table-column.js'
import './components/panel/_panel.js'
import './components/modal/_modal.js'
import './components/drag-modal/_drag-modal.js'
import './components/tabs/_tabs.js'
import './components/tabs/_tab-panel.js'
import './components/active-transition/_active-transition.js'
import './components/date-picker/_date-picker.js'
import './components/pop-confirm/_pop-confirm.js'
import './components/tooltip/_tooltip.js'
import './components/dropdown/_dropdown.js'
import './components/menu/_menu.js'
import './components/menu/_menu-item.js'
import './components/menu/_menu-group.js'
import './components/pagination/_pagination.js'
import './components/steps/_steps.js'
import './components/steps/_step.js'
import './components/tag/_tag.js'
import './components/alert/_alert.js'
import './components/tree/_tree.js'
import './components/tree/_tree-node.js'
import './components/app/_app.js'
import './components/header/_header.js'
import './components/content/_content.js'
import './components/footer/_footer.js'
import './components/transfer/_transfer.js'
import './components/timeline/_timeline.js'

import ticker from './_ticker.js'

import { push } from './components/message/_message-center.js'

const Aurora = {}

Aurora.message = push
Aurora.info = push.bind(window, 'info')
Aurora.danger = push.bind(window, 'danger')
Aurora.warning = push.bind(window, 'warning')
Aurora.success = push.bind(window, 'success')
Aurora.loading = push.bind(window, 'loading')

Vue.use({
  install (Vue, options) {
    Vue.prototype.$message = Aurora.message
  }
})

Aurora.ticker = ticker

window.Aurora = Aurora

export default Aurora
