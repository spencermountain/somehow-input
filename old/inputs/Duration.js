const Input = require('./Input')
const uid = require('../uid')
const mil = require('../milliseconds')

const defaults = {
  min: 0,
  max: mil.year,
  value: mil.month * 6,
  step: mil.day,
  debounce: false
}


class Slider extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('duration')
    this.display_id = this._id + 'display'
    if (obj.show_number === undefined) {
      obj.show_number = true
    }
    this.show_number = obj.show_number
    if (typeof obj.max === 'object') {
      this.attrs.max = this.parseObj(obj.max)
    }
    if (typeof obj.min === 'object') {
      this.attrs.min = this.parseObj(obj.min)
    }
    this._value = this.attrs.value
    if (typeof obj.value === 'object') {
      this._value = this.parseObj(obj.value)
    } else {
      this._value = obj.value
    }
  }
  parseObj(obj) {
    let val = 0
    Object.keys(obj).forEach((k) => {
      val += (mil[k] || 0) * obj[k]
    })
    val *= 1.01
    return val
  }
  round(val) {
    if (this.attrs.decimal) {
      return parseInt(val * 10, 10) / 10
    }
    return parseInt(val, 10)
  }
  displayText(val = 0) {
    if (val >= mil.year * 0.99) {
      return this.round(val / mil.year) + ' years'
    }
    if (val >= mil.month * 0.99) {
      return this.round(val / mil.month) + ' months'
    }
    if (val >= mil.week * 0.99) {
      return this.round(val / mil.week) + ' weeks'
    }
    if (val >= mil.day * 0.99) {
      return this.round(val / mil.day) + ' days'
    }
    return this.round(val / mil.hour) + ' hours'
  }
  redraw() {
    if (this.show_number) {
      let el = document.getElementById(this.display_id)
      el.innerHTML = this.displayText(this._value)
    }
  }
  build() {
    let h = this.h
    this.setCallback()
    let label = ''
    if (this._label) {
      label = this._label + ':'
    }
    return h`<div class="col w100p">
      <div class="grey">${label}</div>
      <input class="w100p" type="range" id="${this._id}" value=${this._value} ...${this.attrs}/>
      <div id="${this.display_id}" class="grey">${this.displayText(this._value)}</div>
    </div>`
  }
}
module.exports = Slider
