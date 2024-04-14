const setTime = (mins) => {
  const time = new Date();
  time.setMinutes(new Date().getMinutes + mins);

  return time.toISOString();
};

const isMajor = (timeToCheck, comparison) => {
  return timeToCheck > comparison;
};

module.exports = {
  setTime,
  isMajor,
};
