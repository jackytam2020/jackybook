import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import notificationRoutes from './routes/notifications.js';
import { newPost } from './controllers/postsController.js';
import { register } from './controllers/auth.js';
import { verifyToken } from './middleware/auth.js';

// MIDDLEWARE CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), newPost);

//ROUTES
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/notifications', notificationRoutes);

//DATABASE CONNECTION SETUP
const PORT = process.env.PORT || 3001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    let onlineUsers = [];

    const addNewUser = (userID, socketID) => {
      !onlineUsers.some((user) => user.userID === userID) &&
        onlineUsers.push({
          userID,
          socketID,
        });
    };

    const removeUser = (socketID) => {
      onlineUsers = onlineUsers.filter((user) => user.socketID !== socketID);
    };

    const getUser = (userID) => {
      return onlineUsers.find((user) => user.userID === userID);
    };
    io.on('connection', (socket) => {
      console.log(`a user connected ${socket.id}`);

      // handle socket events here
      socket.on('newUser', (userID) => {
        addNewUser(userID, socket.id);
        console.log('new user');
      });

      socket.on(
        'sendNotification',
        ({
          senderName,
          senderID,
          senderPicturePath,
          comment,
          receiverID,
          postID,
          type,
          createdAt,
        }) => {
          const receiver = getUser(receiverID);
          if (receiver) {
            io.to(receiver.socketID).emit('getNotification', {
              senderName,
              senderID,
              senderPicturePath,
              comment,
              postID,
              type,
              createdAt,
            });
          }
        }
      );

      socket.on('logout', () => {
        removeUser(socket.id);
        console.log('a user logged out', onlineUsers);
      });

      socket.on('disconnect', () => {
        removeUser(socket.id);
        console.log('a user disconnected');
      });
    });
    server.listen(PORT, () => {
      console.log(`Server Port: ${PORT}`);
    });
    // app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${process.env.MONGO_URL} did not connect`));
