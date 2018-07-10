function broadcast (...args) {
  this.$children.forEach((child) => {
    if (child && child.$emit) {
      child.$emit.apply(child, args)
      broadcast.apply(child, args)
    }
  })
}

export default {
  methods: {
    dispatch (...args) {
      var $parent = this.$parent
      var isOnce = false
      var event, events;

      if (typeof args[0] === 'boolean') {
        isOnce = args[0]
        args.splice(0, 1)
      }

      event = args[0]
      while ($parent != null) {
        events = $parent._events[event]
        if (events && events.length > 0) {
          $parent.$emit.apply($parent, args)
          if (isOnce) {
            break
          }
        }
        $parent = $parent.$parent
      }
    },
    broadcast
  }
}
