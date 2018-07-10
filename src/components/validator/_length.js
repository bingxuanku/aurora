export default function (max, min) {
  var message

  max = parseInt(max) || null
  min = parseInt(min) || null

  if (max != null) {
    if (min != null) {
      message = `输入内容长度为${max}-${min}`
    } else {
      message = `输入内容长度不能超过${max}`
    }
  } else if (min != null) {
    message = `输入内容长度必须大于${min}`
  }

  return {
    message,
    validate (value, callback) {
      const length = value.length
      callback((max == null || length <= max) && (min == null || length >= min))
    }
  }
}
