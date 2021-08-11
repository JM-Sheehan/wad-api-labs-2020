import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import bodyParser from 'body-parser';
import './db';
import {loadUsers} from './seedData';
import genresRouter from './api/genres';
import session from 'express-session';
import passport from './authenticate';
import usersRouter from './api/users';


if (process.env.SEED_DB) {
  loadUsers();
}
dotenv.config();

const errHandler = (err, req, res) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍, ${err.stack} `);
};

const app = express();

const port = process.env.PORT;

app.use(session({
  secret: 'ilikecake',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//update /api/Movie route

app.use(
  '/api/movies', 
  passport.authenticate('jwt', {session: false}), moviesRouter
  );

app.use('/api/genres', genresRouter);
app.use('/api/users', usersRouter);

app.use(errHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});