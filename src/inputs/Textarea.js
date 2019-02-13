const Input = require('./Input')
const uid = require('../uid')

const defaults = {
  min: -100,
  max: 100,
  step: 1,
  size: 200,
  color: '#2D85A8'
}

class Textarea extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('slider')
    this.display_id = this._id + 'display'
    this.show = obj.show
    this.color = obj.color || defaults.color
  }
  moreCallbacks() {
    setTimeout(() => {
      document.getElementById(this._id + '_btn').onclick = () => {
        this.show = !this.show
        if (this.show) {
          document.getElementById(this._id).style.height = '5rem'
          document.getElementById(this._id).style.padding = '1rem'
          document.getElementById(this._id).style.visibility = 'visible'
          document.getElementById(this._id).style.resize = 'both'
        } else {
          document.getElementById(this._id).style.height = '0rem'
          document.getElementById(this._id).style.padding = '0rem'
          document.getElementById(this._id).style.visibility = 'hidden'
          document.getElementById(this._id).style.resize = 'none'
        }
      }
    }, 60)
  }
  makeStyle() {
    let style = 'transition: all 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940);'
    style += ' visibility: hidden; height:0px; padding:0px; resize: none;'
    return style
  }
  build() {
    let h = this.h
    this.setCallback()
    this.moreCallbacks()
    let label = ''
    if (this._label) {
      label = this._label + ':'
    }
    let style = 'border-bottom:3px solid ' + this.color
    let styleplus = 'color:' + this.color
    return h`<div class="col w8">
      <div class="grey pointer b3" style=${style} id="${this._id + '_btn'}">${label}<span style=${styleplus}>＋</span></div>
      <textarea class="w7 rounded" id="${this._id}" style=${this.makeStyle()} ...${this.attrs}>${this._value}</textarea>
    </div>`
  }
}
module.exports = Textarea
