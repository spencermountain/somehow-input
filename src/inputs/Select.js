const Input = require('./Input')
const uid = require('../uid')
const defaults = {}

class Select extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('select')
    this.options = obj.options || []
  }
  setCallback() {
    setTimeout(() => {
      let el = document.getElementById(this._id)
      el.addEventListener('change', (e) => {
        this.callback(e.target.value)
      })
    }, 50)
  }
  build() {
    let h = this.h
    this.setCallback()
    let label = ''
    if (this._label) {
      label = this._label + ':'
    }
    let options = this.options.map((str) => {
      let attr = {}
      if (str === this.attrs.value) {
        attr.selected = "selected"
      }
      return h`<option ...${attr}>
        ${str}
      </options>`
    })
    return h`<div class="col maxw7">
        <div class="grey">${label}</div>
        <select id="${this._id}" value="${this.attrs.value}">
        ${options}
        </select>
      </div>`
  }
}
module.exports = Select
