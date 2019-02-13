const Input = require('./Input')
const uid = require('../uid')

const defaults = {
  min: 0,
  max: 4,
  step: 1,
  size: 200,
  durations: ['1 day', '1 week', '1 month', '3 months', '1 year']
}

class Duration extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('slider')
    this.display_id = this._id + 'display'
    if (obj.show_number === undefined) {
      obj.show_number = true
    }
    this.show_number = obj.show_number
    this.durations = obj.durations || defaults.durations
  }
  getDuration() {
    let h = this.h
    let str = this.durations[this._value] || ''
    let arr = str.split(' ').map((s) => h`<div class="">${s}</div>`)
    return h`<div class="">${arr}</div>`
  }
  redraw() {
    let el = document.getElementById(this.display_id)
    el.innerHTML = this.getDuration()
    let percent = (Number(this._value) / (this.attrs.max)) * 100 //w8
    el.style.left = `${percent}%`
  }
  build() {
    let h = this.h
    this.setCallback()
    let label = ''
    if (this._label) {
      label = this._label + ':'
    }
    let percent = (this._value / this.durations.length) * 100
    let style = `top:10px; left:${percent}%; transform:translateX(-10px)`
    return h`<div class="col w100p">
      <div class="grey">${label}</div>
      <input class="w8" type="range" id="${this._id}" value=${this._value} ...${this.attrs}/>
      <div class="w8 relative center f09">
        <div class="absolute grey" style="${style}" id="${this.display_id}">${this.getDuration()}</div>
      </div>
    </div>`
  }
}
module.exports = Duration
