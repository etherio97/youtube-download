new Vue({
  data: {
    vid: undefined,
    title: undefined,
    channel: undefined,
    format: '',
    formats: [],
    k: '',
    q: '',
  },
  methods: {
    index() {
      if (!this.q) {
        return alert('Video ID is required!');
      }
      this.k = '';
      this.format = '';
      this.vid = undefined;
      this.title = undefined;
      this.channel = undefined;
      this.formats = [];
      axios('/api/index', {
        params: { q: this.q },
      })
        .then(({ data }) => {
          let formats = [];
          let { vid, links, title, a } = data;
          Object.values(links).forEach((data) =>
            formats.push(...Object.values(data))
          );
          this.vid = vid;
          this.title = title;
          this.channel = a;
          this.formats = formats;
        })
        .catch((e) => {
          console.error('Error', e);
          alert('Failed to convert video');
        });
    },
    convert() {
      if (!this.k) {
        return alert('Select format to download!');
      }
      axios('/api/convert', {
        params: { vid: this.vid, k: this.k },
      })
        .then(({ data }) => {
          // prompt('You video will be downloaded soon!', data.dlink);
          location.href = '/download?url=' + encodeURIComponent(data.dlink);
        })
        .catch((e) => {
          console.error('Error', e);
          alert('Failed to convert video');
        });
    },
    restart() {
      this.k = '';
      this.format = '';
      this.vid = undefined;
      this.title = undefined;
      this.channel = undefined;
      this.formats = [];
    },
  },
  computed: {},
}).$mount('main');
