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
      let {min, max} = this.attrs
      let el = document.getElementById(this._id)
      document.getElementById(this._id + 'plus').onclick = () => {
        let num = Number(el.value) + 1
        if (num > min && num < max) {
          el.value = num
        }
      }
      document.getElementById(this._id + 'minus').onclick = () => {
        let num = Number(el.value) - 1
        if (num > min && num < max) {
          el.value = num
        }
      }
    }, 60)
  }
  build() {
    let label = ''
    if (this._label) {
      label = this._label + ':'
    }
    let buttonStyle = 'cursor:pointer; user-select: none; -moz-user-select: none;'
    this.setCallback()
    this.moreCallbacks()
    let {min, max} = this.attrs
    return this.h`<div class="col">
      <div class="grey">${label}</div>
      <div class="row" style="justify-content: center;">
        <div class="bggreygreen rounded h2 w3 white f1 shadow" style=${buttonStyle} id="${this._id + 'minus'}">−</div>
        <input id="${this._id}" class="input shadow center f1" min=${min} max=${max} style="max-width:4rem; margin:0px; font-size:1rem; height:1.2rem;" type="number" value="${this._value}"/>
        <div class="bggreygreen rounded h2 w3 white f1 shadow" style=${buttonStyle} id="${this._id + 'plus'}">+</div>
      </div>
    </div>`
  }
}
module.exports = PlusMinus
