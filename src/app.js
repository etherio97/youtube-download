const { IS_DEV, SERVER_PORT } = require('./config');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

if (IS_DEV) {
  console.log('env:development');
  app.use(require('morgan')('dev'));
} else {
  console.log('env:production');
}

app.use(express.json());

app.listen(SERVER_PORT, () => console.log('> server is running on port: %s', SERVER_PORT));

module.exports = app;
