import datetime from '../utils/_datetime.js'

export default {
  props: {
    startDate: [String, Date],
    endDate: [String, Date],
    disabledDate: Function
  },
  data () {
    return {
      isDisabledFunc: datetime.getIsDisabledFuncByComponent(this)
    }
  }
}
