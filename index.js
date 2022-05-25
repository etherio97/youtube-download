const app = require('./src/app');
const download = require('./src/download');
const YT1S = require('./src/YT1S');

app.get('/', (req, res) => res.render('home'));

app.get('/api/index', async (req, res, next) => {
  let { q } = req.query;
  if (!q) {
    return next({
      status: 400,
      error: 'Bad Request',
      message: 'Required query parameter: q',
    });
  }
  try {
    const { data } = await YT1S.index(q);
    res.json(data);
  } catch (err) {
    next({
      status: err.response && err.response.status,
      error: err.response && err.response.data,
      message: err.message,
    });
  }
});

app.get('/api/convert', async (req, res, next) => {
  let { vid, k } = req.query;
  if (!(vid && k)) {
    return next({
      status: 400,
      error: 'Bad Request',
      message: 'Required query parameters: vid, k',
    });
  }
  try {
    const { data } = await YT1S.convert(vid, k);
    res.json(data);
  } catch (err) {
    next({
      status: err.response && err.response.status,
      error: err.response && err.response.data,
      message: err.message,
    });
  }
});

app.get('/download', (req, res, next) => {
  let { url } = req.query;
  if (!url) {
    return next({
      status: 400,
      error: 'Bad Request',
      message: 'required query parameter: url',
    });
  }
  download(url)
    .then(({ data, headers }) => {
      let disposition = decodeURIComponent(headers['content-disposition'] || '');
      let filename = (disposition.split('filename=')[1] || 'videoplayback.mp4').split(';')[0];
      if (filename.substr(0, 1) === '"') {
        filename = filename.slice(1);
      }
      let l = filename.substr(-1, 1);
      if ([';', '"'].includes(l)) {
        filename = filename.slice(0, l === '"' ? -1 : -2);
      }
      filename = filename.replace('yt1s.com -', '').trim();
      res.setHeader('cache-control', 'public,max-age=86400,s-max-age=86400');
      res.setHeader('content-type', headers['content-type']);
      res.setHeader('content-disposition', `attachment; filename="${encodeURIComponent(filename)}"; filename*=utf-8''${encodeURIComponent(filename)}`);
      res.setHeader('content-length', data.length);
      res.end(data);
    })
    .catch((err) => {
      if ('response' in err) {
        next({
          status: err.response && err.response.status,
          error: err.response && err.response.data,
          message: err.message,
        });
      } else {
        let message = err.message || 'Something went wrong';
        res.redirect('/?error=' + encodeURIComponent(message));
        res.end();
      }
    });
});

/**
 * Route Not Found
 */
app.all('*', (req, res) => res.status(404).send('Not found!'));

/**
 * Error Handler
 */
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong!';
  let error = err.error || 'Internal Server Error';
  res.status(status).json({
    status,
    message,
    error,
  });
});

/**
 * Uncaught Exception Handler
 */
process.on('uncaughtException', (err) => {
  console.log('[ERROR] Critical - ', err);
  console.log('[INFO] Server will exit in next 5 seconds...');
  setTimeout(() => console.log('[INFO] exit with error code 1') | process.exit(1), 5000);
});
