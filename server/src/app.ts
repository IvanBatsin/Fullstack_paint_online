import express, { Application } from 'express';
const app: Application = express();
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { User, SocketRoom, SocketDrawObj, UserRoomsMap } from './intreface/socket';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { SocketActions } from './intreface/socket';
import { router } from './router';

app.use(cors());
app.use(express.json({limit: '50mb'}));

export let rooms: SocketRoom = {};
const usersMap: UserRoomsMap = {};

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', (socket: Socket) => {

  socket.on('disconnect', () => {
    const room = rooms[usersMap[socket.id]];
    const session = usersMap[socket.id];
    
    if (room && room.length > 0) {
      const index = room.findIndex(user => user.socketId === socket.id);
      room.splice(index, 1);
      const users = rooms[usersMap[socket.id]].map(session => session.username);
      io.to(session).emit(SocketActions.EXIT, users);
    }
    socket.leave(usersMap[socket.id]!);
    delete usersMap[socket.id];
    if (room && room.length < 1) {
      fs.unlink(path.join(__dirname, './files', `${session}.jpg`), err => {
        if (err) {
          console.log('exit delete file');
        }
      });
    }
  });

  socket.on(SocketActions.JOIN, (obj: User) => {
    usersMap[socket.id] = obj.session;

    if (!rooms[obj.session]) {
      rooms[obj.session] = [{username: obj.username, socketId: socket.id}];
    } else {
      rooms[obj.session]!.push({username: obj.username, socketId: socket.id});
    }
    
    socket.join(obj.session);
    const users = rooms[obj.session].map(session => session.username);
    io.to(obj.session).emit(SocketActions.JOINED, users);
  });

  socket.on(SocketActions.DRAW, (msg: SocketDrawObj) => {
    io.to(msg.session).emit(SocketActions.DRAW, msg);
  });

  socket.on(SocketActions.DO, ( msg: {session: string, do: string}) => {
    io.to(msg.session).emit(SocketActions.DO, msg);
  });

  socket.on(SocketActions.CLEAR, (session: string) => {
    io.to(session).emit(SocketActions.CLEAR);
  });

  socket.on(SocketActions.IMAGE_UPLOAD, (image: string) => {
    const data = image.replace(/^data:image\/(png|jpg|jpeg);base64/, '');
    const session = usersMap[socket.id];

    fs.writeFile(path.join(__dirname, './files', `${session}.jpg`), data, 'base64', (err) => {
      if (err) return console.log('error');
      io.to(session).emit('update_image', image);
    });
  })
});

app.use(router);
server.listen(5000, () => console.log(' we on air'));