const express = require('express');
const session = require('express-session');
const path = require('path');
const axios = require('axios');
const Web3 = require('web3');

const config = require('./config');
const httpEndpoint = config.getHttpEndpoint();

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const transferRouter = require('./routes/transfer');
const historyRouter = require('./routes/history');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '#1234#',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}))

const instance = axios.create({
  baseURL: httpEndpoint,
  timeout: 3000,
});

// Using Web3 only "convert unit"
const web3 = new Web3();
app.set('web3', web3);
app.set('axiosInstance', instance);

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/transfer', transferRouter);
app.use('/history', historyRouter);


module.exports = app;
