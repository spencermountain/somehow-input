const htm = require('htm')
const vhtml = require('vhtml');
const defaults = {}

class Input {
  constructor(obj = {}) {
    if (typeof obj === 'string') {
      this.id = obj
      obj = {}
    }
    this.attrs = Object.assign({}, defaults, obj)
    this.id = obj.id || 'input'
    this._value = obj.value || ''
    let cb = obj.cb || function() {}
    this.callback = (val) => {
      this._value = val
      cb(val)
    }
    this.mounted = false
    this.el = null
    this.h = htm.bind(vhtml);
  }
  bind(fn) {
    this.h = htm.bind(fn);
  }
  default(val) {
    this._value = val
    this.world.state[this.id] = this._value
    return this
  }
  setCallback() {
    setTimeout(() => {
      let el = document.getElementById(this.id)
      if (el) {
        el.addEventListener('input', (e) => {
          this.callback(e.target.value)
        })
      }
    }, 50)
  }
  build() {
    let h = this.world.html
    this.setCallback()
    return h`<input id="${this._id}" class="input" type="text" value="${this._value}"/>`
  }
}
module.exports = Input
