const ytsearch = require('yt-search');

class YTSearch {
  static search(q) {
    return ytsearch(q).then((data) => data.all);
  }

  static videos(q) {
    return ytsearch(q).then((data) => data.videos);
  }

  static live(q) {
    return ytsearch(q).then((data) => data.live);
  }

  static playlists(q) {
    return ytsearch(q).then((data) => data.playlists);
  }

  static lists(q) {
    return ytsearch(q).then((data) => data.lists);
  }

  static accounts(q) {
    return ytsearch(q).then((data) => data.accounts);
  }

  static channels(q) {
    return ytsearch(q).then((data) => data.channels);
  }
}

module.exports = YTSearch;
