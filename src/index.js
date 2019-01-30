const Input = require('./inputs/Input')
const Slider = require('./inputs/Slider')
const PlusMinus = require('./inputs/PlusMinus')

const inputs = {
  input: (obj) => new Input(obj),
  slider: (obj) => new Slider(obj),
  plusMinus: (obj) => new PlusMinus(obj),
}
module.exports = inputs
