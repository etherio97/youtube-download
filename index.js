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
  } catch (e) {
    next({
      status: e.response && e.response.status,
      error: e.response && e.response.data,
      message: e.message,
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
  } catch (e) {
    next({
      status: e.response && e.response.status,
      error: e.response && e.response.data,
      message: e.message,
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
      let disposition = headers['content-disposition'];
      let filename = disposition.split('filename=')[1] || 'videoplayback.mp4';
      if (filename.substr(0, 1) === '"') {
        filename = filename.slice(1);
      }
      if (filename.substr(-1, 1) === '"') {
        filename = filename.slice(0, -1);
      }
      filename = filename.replace('yt1s.com -', '').trim();
      res.setHeader('content-type', headers['content-type']);
      res.setHeader('content-disposition', `attachment; filename="${filename}"`);
      res.setHeader('content-length', data.length);
      res.end(data);
    })
    .catch((e) => {
      next({
        status: e.response && e.response.status,
        error: e.response && e.response.data,
        message: e.message,
      });
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
