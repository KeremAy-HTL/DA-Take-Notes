import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import { errorHandler, notFoundHandler } from './error/errorHandler.js';

import authRoutes from './api/routes/authentication.js';
import uploadsRouter from './api/routes/upload.js';
import databaseRouter from './api/routes/db.js';
import groupRouter from './api/routes/groups.js';
import defaultRouter from './api/routes/index.js';

dotenv.config();
const { SESSION_LIFETIME, SESSION_NAME, SESSION_SECRET } = process.env;

const dirname = path.resolve();

const app = express();

app.use(morgan('dev'));

const corsConfig = {
  origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://localhost:4173'], // or '*' to allow all (not recommended for production)
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.static(path.join(dirname, '/public')));

app.use(
  session({
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: SESSION_LIFETIME * 1000 * 60 * 60,
      httpOnly: false,
      sameSite: false,
      secure: false,
    },
  }),
);

app.use(express.json());

app.use('/', defaultRouter);

app.use('/auth', authRoutes);
app.use('/uploads', uploadsRouter);
app.use('/database', databaseRouter);
app.use('/groups', groupRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
console.log('Server started');
