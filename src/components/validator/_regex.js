export default function (regex) {
  var message

  if (!regex instanceof RegExp) {
    if (regex.match(/^\^|\$$/) == null) {
      regex = '^' + regex + '$'
    }
    regex = new RegExp(regex)
  }

  return {
    message: `输入的内容格式有误`,
    validate (value, callback) {
      callback(regex.test(value) != null)
    }
  }
}
