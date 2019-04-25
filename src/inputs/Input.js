const htm = require('htm')
const vhtml = require('vhtml')
const uid = require('../uid')
const urlParam = require('../url-param')
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
    //override value from url param
    if (this.attrs.param) {
      this._value = urlParam.get(this.attrs.param) || this._value
    }
    this._label = obj.label || ''
    let cb = obj.cb || function() {}
    this.callback = val => {
      this._value = val
      this.redraw()
      cb(val)
    }
    this.timeout = null
    this.el = null
    this.h = htm.bind(vhtml)

    this.el = obj.el || null
  }
  bind(fn) {
    this.h = htm.bind(fn)
  }
  debounce(cb, duration) {
    //support immediate-mode
    if (this.attrs.debounce === false) {
      cb()
      return
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(cb, duration)
  }
  setUrl(val) {
    if (this.attrs.param) {
      let url = urlParam.set(window.location.href, this.attrs.param, val)
      window.history.replaceState('', '', url)
    }
  }
  setCallback() {
    setTimeout(() => {
      let el = document.getElementById(this._id)
      el.addEventListener('input', e => {
        this.debounce(() => {
          let val = e.target.value
          this.setUrl(val)
          this.callback(val)
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
      <input id="${
        this._id
      }" class="input" style="max-width:8rem; padding-right:0px;" type="text" style=${style} value="${
      this._value
    }"/>
    </div>`
  }
}
module.exports = Input
