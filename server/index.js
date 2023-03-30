import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

//route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import notificationRoutes from './routes/notifications.js';

//controller imports
import { newPost } from './controllers/postsController.js';
import { register } from './controllers/auth.js';
import { addNewProfilePicture } from './controllers/usersController.js';

//middleware imports
import { verifyToken } from './middleware/auth.js';

//exported functions
import { connectDB } from './config/database.js';
// import { addNewUser, removeUser, getUser } from './socket/onlineUsers.js';

// MIDDLEWARE CONFIGURATIONS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });
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
app.patch(
  '/:id/addNewProfilePicture',
  upload.single('picture'),
  addNewProfilePicture
);

//ROUTES
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/notifications', notificationRoutes);

//DATABASE CONNECTION SETUP
const PORT = process.env.PORT || 3001;
//connect to MongoDB Schema
connectDB();

//socket functions
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });
// let onlineUsers = [];

// io.on('connection', (socket) => {
//   console.log(`a user connected ${onlineUsers}`);

//   // handle socket events here
//   socket.on('newUser', (userID) => {
//     addNewUser(userID, socket.id, onlineUsers);
//     console.log('new user');
//   });

//   socket.on(
//     'sendNotification',
//     ({
//       senderName,
//       senderID,
//       senderPicturePath,
//       comment,
//       receiverID,
//       postID,
//       type,
//       createdAt,
//     }) => {
//       const receiver = getUser(receiverID, onlineUsers);
//       if (receiver) {
//         io.to(receiver.socketID).emit('getNotification', {
//           senderName,
//           senderID,
//           senderPicturePath,
//           comment,
//           postID,
//           type,
//           createdAt,
//         });
//       }
//     }
//   );

//   socket.on('logout', () => {
//     removeUser(socket.id, onlineUsers);
//     console.log('a user logged out', onlineUsers);
//   });

//   socket.on('disconnect', () => {
//     removeUser(socket.id, onlineUsers);
//     console.log('a user disconnected');
//   });
// });
server.listen(PORT, () => {
  console.log(`Server Port: ${PORT}`);
});
