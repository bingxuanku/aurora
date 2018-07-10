export default function (whitespace) {
  return {
    message: `内容不能为空`,
    validate (value, callback) {
      callback(
        value != null && value !== '' && (whitespace !== true || typeof value !== 'string' || !/^\s+$/.test(value))
      )
    }
  }
}
