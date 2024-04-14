const genNumberCode = ({ min = 100000, max = 899999 }) => {
  return Math.round(Math.random() * min + max);
};

module.exports = {
  genNumberCode,
};
