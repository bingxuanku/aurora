import required from './_required.js'
import email from './_email.js'
import phone from './_phone.js'
import length from './_length.js'

export default class Validator {
  constructor (rules) {
    this.timestamp
    if (rules) {
      this.setRules(rules)
    }
  }

  setRules (rules) {
    this.rules = rules
    this.rules.forEach((rule) => {
      if (rule.trigger) {
        rule._trigger = rule.trigger.split(/\s*[,\s]\s*/)
      }
    })
  }

  validate (trigger, value, callback) {
    var count = this.rules.length
    var result = true
    const self = this
    const messages = []
    const timestamp = this.timestamp = new Date()

    this.rules.forEach((rule) => {
      if (!trigger || !rule._trigger || rule._trigger.indexOf(trigger) > -1) {
        const validator = this.getValidator(rule)
        validator.validate(value, (_result) => {
          if (!_result) {
            messages.push(rule.message || validator.message)
          }
          checkValidate()
        })
      } else {
        checkValidate()
      }
    })

    function checkValidate () {
      count--
      if (count === 0 && timestamp === self.timestamp) {
        callback(messages)
      }
    }
  }

  getValidator (rule) {
    if (rule.validator) {
      return {
        message: rule.message,
        validate: rule.validator
      }
    }

    if (rule.required) {
      return required(rule.whitespace)
    }

    if (rule.max != null || rule.min != null) {
      return length(rule.max, rule.min)
    }

    switch (rule.type) {
      case 'email':
        return email
      case 'phone':
        return phone
      default:
        console.error(`No validate matched: `, rule.type)
        return {
          validate: (_, callback) => {
            callback(true)
          }
        }
    }
  }
}
