const Input = require('./Input')
const uid = require('../uid')

const defaults = {}

class ColorPicker extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('_color')
    this.labels = obj.labels || {}
    this.color = obj.color || defaults.color
  }
  setCallback() {
    setTimeout(() => {
      let el = document.getElementById(this._id)
      el.addEventListener('click', e => {
        this.callback(e.target.value)
      })
    }, 50)
  }
  chooseColor() {
    this.debounce(() => {
      this.callback(e.target.value)
    }, 300)
  }
  moreCallbacks() {
    setTimeout(() => {
      document.getElementById(this._id).onclick = () => {
        console.log('hi')
      }
    })
  }

  drawBox(c) {
    let style = `background-color:${c};`
    if (this.attrs.value === c) {
      style += 'border:3px solid whitesmoke;'
    }
    return this.h`<div class="h3 w3 shadow colorChoice" style="${style}"></div>`
  }
  build() {
    let h = this.h
    this.setCallback()
    let label = ''
    if (this._label) {
      label = this._label + ':'
    }
    let options = this.attrs.options.map(c => {
      return this.drawBox(c)
    })
    return h`
    <div class="col">
      <div class="grey center ulblue">${label}</div>
      <div class="row nowrap" id="${this._id}">
        ${options}
      </div>
    </div>`
  }
}
module.exports = ColorPicker
