//may need to change when the term really-transforms? not sure.
const uid = (str) => {
  let nums = '';
  for (let i = 0; i < 5; i++) {
    nums += parseInt(Math.random() * 9, 10);
  }
  return str + '-' + nums;
};
module.exports = uid;
