const htm = require('htm')
const vhtml = require('vhtml');
const uid = require('../uid')
const defaults = {}

class Input {
  constructor(obj = {}) {
    if (typeof obj === 'string') {
      this._id = obj
      obj = {}
    }
    this.attrs = Object.assign({}, defaults, obj)
    this._id = obj.id || uid('input')
    this._value = obj.value || ''
    this._label = obj.label || ''
    let cb = obj.cb || function() {}
    this.callback = (val) => {
      this._value = val
      this.redraw()
      cb(val)
    }
    this.timeout = null
    this.el = null
    this.h = htm.bind(vhtml);

    this.el = obj.el || null
  }
  bind(fn) {
    this.h = htm.bind(fn);
  }
  debounce(cb, duration) {
    //support immediate-mode
    if (this.attrs.debounce === false) {
      cb()
      return
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(cb, duration)
  }
  setCallback() {
    setTimeout(() => {
      let el = document.getElementById(this._id)
      el.addEventListener('input', (e) => {
        this.debounce(() => {
          this.callback(e.target.value)
        }, 300)
      })
    }, 50)
  }
  redraw() {}
  build() {
    let label = ''
    if (this._label) {
      label = this._label + ':'
    }
    this.setCallback()
    let style = ''
    if (this.attrs.width) {
      style = `max-width:${this.attrs.width}px; min-width:10px;`
    }
    return this.h`<div class="col">
      <div class="grey">${label}</div>
      <input id="${this._id}" class="input" style="max-width:8rem; padding-right:0px;" type="text" style=${style} value="${this._value}"/>
    </div>`
  }
}
module.exports = Input
