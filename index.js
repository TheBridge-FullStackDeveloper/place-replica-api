const express = require('express')
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const port = process.env.PORT || 8080

const app = express()
var whitelist = ['*']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('Hola Mundo!')
})

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');
  socket.on('message', (msg) => {
    io.emit('message', msg);
  });

  socket.on('place', (pixel) => {
    io.emit('place', pixel);
  });

  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado');
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
