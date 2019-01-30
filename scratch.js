const inputs = require('./src')
// const somehow = require('./builds/somehow')

let slider = inputs.slider({
  el: '#stage',
  width: 600,
  max: 200,
  min: -100,
  value: 50,
  label: 'number'
})

document.querySelector('#slider').innerHTML = slider.build()
