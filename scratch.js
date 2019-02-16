const inputs = require('./src')
// const somehow = require('./builds/somehow')

let input = inputs.input({
  el: '#input',
  width: 600,
  value: 'tofu',
  label: 'input',
  cb: (val) => console.log(val)
})
document.querySelector('#input').innerHTML = input.build()

let select = inputs.select({
  el: '#select',
  value: 'cat',
  label: 'choice',
  options: ['alligator', 'dog', 'porcuipine', 'cat', 'sloth'],
  cb: (val) => console.log(val)
})
document.querySelector('#select').innerHTML = select.build()

let slider = inputs.slider({
  el: '#slider',
  width: 600,
  max: 200,
  min: -100,
  value: 50,
  debounce: true,
  cb: (val) => console.log('slider: ' + val),
  label: 'number'
})
document.querySelector('#slider').innerHTML = slider.build()

let vslider = inputs.vslider({
  el: '#vslider',
  width: 600,
  max: 200,
  min: -100,
  value: 50,
  // reverse: true,
  label: 'number'
})
document.querySelector('#vslider').innerHTML = vslider.build()

let tabs = inputs.tabs({
  el: '#tabs',
  value: 'cat',
  label: 'tabs',
  tabs: ['dog', 'cat', 'cow', 'pig']
})
document.querySelector('#tabs').innerHTML = tabs.build()

let legend = inputs.legend({
  el: '#legend',
  label: 'legend',
  labels: {
    'green': 'green',
    'brown': 'brown',
    'red': 'red',
    'pink': 'pink'
  }
})
document.querySelector('#legend').innerHTML = legend.build()

let duration = inputs.duration({
  el: '#duration',
  value: {
    year: 4
  },
  min: {
    month: 3
  },
  label: 'duration',
  max: {
    'year': 12
  }
})
document.querySelector('#duration').innerHTML = duration.build()

let plusMinus = inputs.plusMinus({
  el: '#plusminus',
  width: 600,
  value: 50,
  label: 'input'
})
document.querySelector('#plusminus').innerHTML = plusMinus.build()

let textarea = inputs.textarea({
  el: '#textarea',
  width: 600,
  value: 'hello\nthere',
  label: 'textarea',
  cb: (val) => console.log(val)
})
document.querySelector('#textarea').innerHTML = textarea.build()
let textarea2 = inputs.textarea({
  el: '#textarea2',
  width: 600,
  value: 'hello\nthere',
  label: 'text2',
  color: '#AB5850',
  cb: (val) => console.log(val)
})
document.querySelector('#textarea2').innerHTML = textarea2.build()
