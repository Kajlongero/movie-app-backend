require("dotenv").config();

const handleApiFetch = async (url, method = "GET") => {
  const response = await fetch(url, {
    method: method,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  });
  const result = await response.json();

  return result;
};

module.exports = {
  handleApiFetch,
};
