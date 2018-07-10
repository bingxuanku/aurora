var re = /^1\d{10}$/

export default {
  validate (value, callback) {
    callback(
      !value || typeof value === 'string' && value.match(re) != null
    )
  }
}
