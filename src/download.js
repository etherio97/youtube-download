const { default: axios } = require('axios');

function download(url) {
  return axios(url, {
    responseType: 'arraybuffer',
  });
}

module.exports = download;
