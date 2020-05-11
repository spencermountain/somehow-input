const Input = require('./Input')
const uid = require('../uid')

const defaults = {
  show: true,
  color: '#2D85A8',
  height: '16rem',
  width: '10rem'
}

class Textarea extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('textarea')
    this.display_id = this._id + 'display'
    this.show = this.attrs.show
    this.height = this.attrs.height
    this.width = this.attrs.width
    this.color = obj.color || defaults.color
  }
  moreCallbacks() {
    setTimeout(() => {
      document.getElementById(this._id + '_btn').onclick = () => {
        this.show = !this.show
        let el = document.getElementById(this._id)
        if (this.show) {
          el.style.height = this.height
          el.style.padding = '1rem'
          el.style.visibility = 'visible'
          el.style.resize = 'both'
          el.scrollTop = el.scrollHeight
        } else {
          el.style.height = '0rem'
          el.style.padding = '0rem'
          el.style.visibility = 'hidden'
          el.style.resize = 'none'
        }
      }
    }, 60)
  }
  makeStyle() {
    let style =
      'transition: all 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940); font-size:10px; font-family: monospace;'
    style += ` visibility: visible; height:${
      this.height
    }; padding:1rem; resize: both;`
    style += ` border:6px solid ${this.color}; color:${this.color}; width:${
      this.width
    }; border-radius:7px; `
    style += `border-left:1px solid ${this.color}; border-right:1px solid ${
      this.color
    };`
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
    let style =
      'padding:0.5rem; user-select: none; margin-left:0.5rem; background-color: ' +
      this.color
    let button = h`<div class="grey pointer ullighter b3 white" style=${style} id="${this
      ._id + '_btn'}">
      ${label}
      <span class="white f2" style="margin:0.5rem;">+</span>
      </div>`
    if (this.show) {
      button = null
    }
    return h`<div class="col w9">
      ${button}
      <textarea class="w7" id="${this._id}" style=${this.makeStyle()} ...${
      this.attrs
    }>${this._value}</textarea>
    </div>`
  }
}
module.exports = Textarea