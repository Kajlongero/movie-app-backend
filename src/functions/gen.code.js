const generateCode = ({ min = 100000, max = 899999 }) => {
  return Math.round(Math.random() * max) + min;
};

module.exports = generateCode;
