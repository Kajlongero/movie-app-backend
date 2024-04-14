const setTime = (mins) => {
  const time = new Date();
  time.setMinutes(time.getMinutes() + mins);

  return time.toISOString();
};

module.exports = setTime;
