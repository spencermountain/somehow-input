const Input = require('./Input')
// const colors = require('spencer-color').colors
const uid = require('../uid')

const defaults = {
  color: '#2D85A8'
}

class Button extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('_btn')
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
  build() {
    let h = this.h
    this.setCallback()
    let label = ''
    if (this._label) {
      label = this._label + ':'
    }
    let style =
      'padding:0.5rem; margin-left:0.5rem; user-select: none; background-color: ' +
      this.color
    return h`<div class="col maxw7">
      <div class="grey center ulblue">${label}</div>
      <div class="grey pointer ullighter b3 white" style=${style} id="${
      this._id
    }">
    ${this.attrs.value}
    </div>
      </div>`
    // <button ...${this.attrs} class="f2">${this.attrs.value}</button>
  }
}
module.exports = Button
