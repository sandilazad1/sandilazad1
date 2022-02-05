const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const tempRoutes = require('./routes/temp.js');
const authRoutes = require('./routes/auth');
const socketIO = require('socket.io');

const cors = require('cors');

const port = process.env.port || 3000;

const app = express();

const atlasUri =
  'mongodb+srv://auth:auth@123@practice.6n21r.mongodb.net/chartDB?retryWrites=true&w=majority';
const localDbUrl = 'mongodb://localhost:27017/developer';

mongoose.connect(atlasUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: false,
})
  .then(() => {
    console.log('Connected');
  }).catch(() => {
    console.log('Not Connected');
  })

app.use(cors({
    origin: '*'
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/temp', tempRoutes);
app.use('/auth', authRoutes);

const server = http.createServer(app);
const io = socketIO(server);
app.set('io', io);

app.use(express.static(path.join(__dirname, 'dist/real-time-chart')));
app.use('/*', express.static(path.join(__dirname, 'dist/real-time-chart')));


server.listen(port);
