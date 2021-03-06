Vue.component('loading-spinner', {
  template: document.getElementById('loading-spinner').innerHTML,
  data: () => ({ visible: false }),
  mounted() {
    setTimeout(() => {
      this.visible = true;
    }, 80);
  },
});

new Vue({
  data: {
    isLoading: false,
    vid: undefined,
    videoUrl: undefined,
    title: undefined,
    channel: undefined,
    format: '',
    results: [],
    searchResults: [],
    formats: [],
    k: '',
    q: '',
  },
  methods: {
    getThumbnailUrl(vid, size = '0') {
      return `https://i.ytimg.com/vi/${vid}/${size}.jpg`;
    },
    index() {
      if (!this.q) {
        return alert('Video ID is required!');
      }
      if (!this.isIndex) {
        return this.search();
      }
      this.restart();
      this.isLoading = true;
      axios('/api/index', {
        params: { q: this.q },
      })
        .then(({ data }) => {
          this.isLoading = false;
          if (data.p === 'search') {
            this.results = data.items;
          } else {
            let formats = [];
            let { vid, links, title, a } = data;
            Object.values(links).forEach((data) =>
              formats.push(...Object.values(data))
            );
            this.vid = vid;
            this.title = title;
            this.channel = a;
            this.formats = formats;
          }
        })
        .catch((e) => {
          console.error('Error', e);
          this.isLoading = false;
          alert('Failed to convert video');
        });
    },
    convert() {
      if (!this.k) {
        return alert('Select format to download!');
      }
      this.isLoading = true;
      axios('/api/convert', {
        params: { vid: this.vid, k: this.k },
      })
        .then(({ data }) => {
          location.href = '/download?url=' + encodeURIComponent(data.dlink);
          setTimeout(() => {
            this.isLoading = false;
          }, 5000);
        })
        .catch((e) => {
          console.error('Error', e);
          this.isLoading = false;
          alert('Failed to download video');
        });
    },
    search() {
      let q = this.q || '';
      this.results = [];
      this.isLoading = true;
      axios('/api/search/videos', { params: { q } })
        .then(({ data }) => {
          this.isLoading = false;
          this.results = data;
        })
        .catch((e) => {
          console.error('Error', e);
          this.isLoading = false;
          alert('Unable to search videos');
        });
    },
    restart() {
      this.k = '';
      this.format = '';
      this.videoUrl = '';
      this.vid = undefined;
      this.title = undefined;
      this.channel = undefined;
      this.results = [];
      this.formats = [];
    },
    selectVideo(id) {
      this.q = id;
      this.index();
    },
    watchVideo() {
      if (!this.formats.length) return;
      let formats = this.formats
        .filter((f) => f.f === 'mp4')
        .sort((a, b) => (parseInt(b.q) || 0) - (parseInt(a.q) || 0));
      let format = formats.find((f) => f.q === '360p') 
        || formats.find((f) => f.q === '240p')
        || formats.find((f) => f.q === '144p')
        || formats[0];
      this.isLoading = true;
      axios('/api/convert', {
        params: { vid: this.vid, k: format.k },
      })
        .then(({ data }) => {
          this.isLoading = false;
          this.videoUrl = '/download?url=' + encodeURIComponent(data.dlink);
        })
        .catch((e) => {
          this.isLoading = false;
          console.error('ERROR',e);
          alert('Unable to play video');
        });
    },
    unmuteVideo() {
      let videoEl = this.$refs.videoEl;
      if (!(videoEl instanceof HTMLVideoElement)) return;
      if (videoEl.muted) {
        videoEl.volume = 1;
        videoEl.removeAttribute('muted');
        videoEl.style.cursor = 'auto';
      }
    },
  },
  beforeMount() {
    let params = new URLSearchParams(location.search);
    if (params.has('error')) {
      let error = params.get('error');
      history.pushState({}, '', location.pathname);
      alert(error);
    }
  },
  computed: {
    isIndex() {
      if (!this.q) return true;
      try {
        new URL(this.q);
        return true;
      } catch (e) {
        return !this.q.includes(' ') && this.q.length === 11;
      }
    },
  },
}).$mount('main');
