const Input = require('./Input')
const uid = require('../uid')

const defaults = {
  min: -100,
  max: 100,
  step: 1,
  size: 200,
}

class Slider extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('slider')
    this.display_id = this._id + 'display'
    if (obj.show_number === undefined) {
      obj.show_number = true
    }
    this.show_number = obj.show_number
  }
  redraw() {
    if (this.show_number) {
      let el = document.getElementById(this.display_id)
      el.innerHTML = this._value
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
      <div id="${this.display_id}" class="grey">${this._value}</div>
    </div>`
  }
}
module.exports = Slider
