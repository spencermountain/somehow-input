const Input = require('./Input')
const colors = require('spencer-color').colors
const uid = require('../uid')

const defaults = {}

class Legend extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('slider')
    this.labels = obj.labels || {}
  }
  build() {
    let h = this.h
    this.setCallback()
    let label = ''
    if (this._label) {
      label = this._label + ':'
    }
    let labels = Object.keys(this.labels).map((k) => {
      let color = colors[this.labels[k]] || this.labels[k]
      let bar = `height:5px; background-color:${color};`
      return h`<div class="row-left pointer legend-row">
        <div class="w2 rounded m1" style="${bar}"></div>
        <div class="grey">${k}</div>
      </div>`
    })
    return h`<div class="col maxw7" id="${this._id}">
      <div class="grey center ulblue">${label}</div>
      ${labels}
      </div>`
  }
}
module.exports = Legend
