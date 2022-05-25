const ytsearch = require('yt-search');

class YTSearch {
  static search(q) {
    return ytsearch(q);
  }
}

module.exports = YTSearch;
