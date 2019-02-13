const Input = require('./Input')
const uid = require('../uid')

const defaults = {
  light: '#b5bbbf',
  lighter: '#b5bbbf',
  selected: '#2D85A8',
  tabs: []
}

class Tabs extends Input {
  constructor(obj = {}) {
    super(obj)
    this.attrs = Object.assign({}, defaults, this.attrs)
    this._id = obj.id || uid('slider')
    this.tabs = obj.tabs || defaults.tabs
    this.value = obj.value || this.tabs[0]
  }
  moreCallbacks() {
    setTimeout(() => {
      // document.queryString('.somehow-tab')
      let tabs = document.querySelectorAll('.somehow-tab')
      for (let i = 0; i < tabs.length; i += 1) {
        let tab = tabs[i]
        tab.onclick = function(e) {
          for (let j = 0; j < tabs.length; j += 1) {
            tabs[j].style.color = defaults.light
            tabs[j].style['border-color'] = 'rgba(181, 187, 191, 0.1)'
          }
          e.target.style.color = defaults.selected
          e.target.style['border-color'] = defaults.selected
        }
      }
    }, 60)
  }
  makeTabs() {
    let h = this.h
    let tabs = this.tabs.map((str) => {
      let style = `margin-left:4px; margin-right:4px; padding-left:4px; padding-right:4px; `
      style += 'transition: all 0.1s cubic-bezier(0.250, 0.460, 0.450, 0.940);'
      if (this.value !== str) {
        style += `border-bottom:3px solid rgba(181, 187, 191, 0.1); color:${defaults.light}`
      } else {
        style += `border-bottom:3px solid ${defaults.selected}; color:${defaults.selected}`
      }
      return h`<div class="pointer somehow-tab f2 grow" style="${style}">${str}</div>`
    })
    return tabs
  }
  build() {
    let h = this.h
    this.setCallback()
    this.moreCallbacks()
    let label = ''
    if (this._label) {
      label = this._label + ' :'
    }
    let tabs = this.makeTabs()
    return h`<div class="col w100p" style="user-select: none; -moz-user-select: none;">
      <div class="grey ullight b05 mb1">${label}</div>
      <div class="row" id=${this._id}>${tabs}</div>
    </div>`
  }
}
module.exports = Tabs
