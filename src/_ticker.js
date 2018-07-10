export default (() => {
  const events = []
  var interval = null
  var isStart = false

  function start () {
    isStart = true
    interval = setInterval(() => {
      if (events.length === 0) {
        return
      }
      events.forEach((callback) => {
        callback()
      })
    }, 1000 / 60)
  }

  function stop () {
    isStart = false
    clearInterval(interval)
    interval = null
  }

  return {
    add (event) {
      events.push(event)
      if (!isStart) {
        start()
      }
    },
    remove (event) {
      const pos = events.indexOf(event)
      if (pos > -1) {
        events.splice(pos, 1)
        if (events.length === 0) {
          stop()
        }
      }
    }
  }
})()
