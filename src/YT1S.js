const { YT1S_URL, YT1S_INDEX, YT1S_CONVERT, USER_AGENT } = require('./config');
const { default: axios } = require('axios');

class YT1S {
  /**
   * @returns object
   */
  static getHeaders() {
    return {
      Origin: YT1S_URL + '/',
      Referer: YT1S_URL + '/en235',
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    };
  }
  
  /**
   * @static
   * @param string id
   * @return Promise<any>
   */
  static index(id) {
    let requestData = new URLSearchParams({
      vt: 'home',
      q: id.length === 11 ? `https://youtu.be/${id}` : id,
    });
    let options = {
      headers: this.getHeaders(),
    };
    return axios.post(YT1S_INDEX, requestData.toString(), options);
  }
  
  /**
   * @static
   * @param string vid
   * @param string k
   * @return Promise<any>
   */
  static convert(vid, k) {
    let requestData = new URLSearchParams({
      k,
      vid,
    });
    let options = {
      headers: this.getHeaders(),
    };
    return axios.post(YT1S_CONVERT, requestData.toString(), options);
  }
}

module.exports = YT1S;
