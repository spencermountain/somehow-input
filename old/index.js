const Input = require('./inputs/Input')
const Slider = require('./inputs/Slider')
const Vslider = require('./inputs/Vslider')
const PlusMinus = require('./inputs/PlusMinus')
const Textarea = require('./inputs/Textarea')
const Duration = require('./inputs/Duration')
const Tabs = require('./inputs/Tabs')
const Legend = require('./inputs/Legend')
const Select = require('./inputs/Select')
const Button = require('./inputs/Button')
const ColorPicker = require('./inputs/ColorPicker')

const inputs = {
  input: obj => new Input(obj),
  slider: obj => new Slider(obj),
  vslider: obj => new Vslider(obj),
  plusMinus: obj => new PlusMinus(obj),
  textarea: obj => new Textarea(obj),
  duration: obj => new Duration(obj),
  legend: obj => new Legend(obj),
  tabs: obj => new Tabs(obj),
  select: obj => new Select(obj),
  button: obj => new Button(obj),
  colorPicker: obj => new ColorPicker(obj)
}
module.exports = inputs
