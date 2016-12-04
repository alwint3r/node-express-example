const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const swig = require('swig');

const app = express();
const port = 8000;

const staticPath = path.join(__dirname, '/static');
const htmlPath = path.join(__dirname, '/html');
const nodeModules = path.join(__dirname, '/node_modules');

swig.setDefaults({ cache: false });
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

app.use('/static', express.static(staticPath));
app.use('/static', express.static(nodeModules));
// app.use('/', express.static(htmlPath));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/forloop', (req, res) => {
  const data = {
    list: [
      'iPhone',
      'Samsung',
      'Asus',
      'Macbook',
      'Sandisk',
    ],
  };

  res.render('forloop', data);
});

app.post('/submit', (req, res, next) => {
  if (!req.body.nama || !req.body.email) {
    return next(new Error('Nama & email harus diisi!'));
  }

  const data = {
    nama: req.body.nama,
    email: req.body.email,
  };

  res.render('display', data);
});

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;

  return next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status);
  res.end(http.STATUS_CODES[status] + '\n' + err.message);
});

app.listen(port, () => {
  console.log('Express app is listening on port ' + port);
});
