const { default: axios } = require('axios');

const download = (url) => {
  return axios(url, {
    responseType: 'arraybuffer',
  });
};

module.exports = download;
