const scaleLinear = function (obj) {
  let world = obj.world || []
  let minmax = obj.minmax || []
  const calc = (num) => {
    let range = minmax[1] - minmax[0]
    let percent = (num - minmax[0]) / range
    let size = world[1] - world[0]
    let res = size * percent
    if (res > minmax.max) {
      return minmax.max
    }
    if (res < minmax.min) {
      return minmax.min
    }
    return res
  }
  // invert the calculation. return a %?
  calc.backward = (num) => {
    let size = world[1] - world[0]
    let range = minmax[1] - minmax[0]
    let percent = (num - world[0]) / size
    return percent * range
  }
  return calc
}
export default scaleLinear
