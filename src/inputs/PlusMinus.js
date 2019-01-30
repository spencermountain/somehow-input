const Input = require('./Input')
const uid = require('../uid')

const defaults = {
  min: -100,
  max: 100,
  step: 1,
  size: 200,
}

class PlusMinus extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('plusminus')
  }
  moreCallbacks() {
    setTimeout(() => {
      let el = document.getElementById(this._id)
      document.getElementById(this._id + 'plus').onclick = () => {
        el.value = Number(el.value) + 1
      }
      document.getElementById(this._id + 'minus').onclick = () => {
        el.value = Number(el.value) + 1
      }
      console.log(el, el.value)
    }, 60)
  }
  build() {
    let label = ''
    if (this._label) {
      label = this._label + ':'
    }
    let buttonStyle = 'cursor:pointer; user-select: none;'
    this.setCallback()
    this.moreCallbacks()
    let {min, max} = this.attrs
    return this.h`<div class="col">
      <div class="grey">${label}</div>
      <div class="row" style="justify-content: center;">
        <div class="bggreygreen rounded h3 w4 white f2 shadow" style=${buttonStyle} id="${this._id + 'plus'}">+</div>
        <input id="${this._id}" class="input shadow center" min=${min} max=${max} style="max-width:6rem; margin:0px;" type="number" value="${this._value}"/>
        <div class="bggreygreen rounded h3 w4 white f2 shadow" style=${buttonStyle} id="${this._id + 'minus'}">−</div>
      </div>
    </div>`
  }
}
module.exports = PlusMinus
