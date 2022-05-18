import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nms from './MediaServer.js';
import theSocket from './app/controllers/socketIO.js';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
theSocket(io);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('socketio', io);
app.set('server', server);
app.use(express.static(`${path.join(__dirname, '/public')}`));
server.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`listening on port ${process.env.PORT}`);
    }
});
nms.run();


