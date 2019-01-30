const inputs = require('./src')
// const somehow = require('./builds/somehow')

let input = inputs.input({
  el: '#input',
  width: 600,
  value: 'tofu',
  label: 'input'
})
document.querySelector('#input').innerHTML = input.build()

let slider = inputs.slider({
  el: '#slider',
  width: 600,
  max: 200,
  min: -100,
  value: 50,
  label: 'number'
})
document.querySelector('#slider').innerHTML = slider.build()

let plusMinus = inputs.plusMinus({
  el: '#plusminus',
  width: 600,
  value: 50,
  label: 'input'
})
document.querySelector('#plusminus').innerHTML = plusMinus.build()
