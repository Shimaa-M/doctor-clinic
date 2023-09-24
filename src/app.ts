import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';

dotenv.config();

const app = express();
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

 // set security HTTP headers
app.use(helmet());

// enable cors
app.use(cors());
app.options('*', cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use(ExpressMongoSanitize());


app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});
app.use('/v1/auth', authRouter);
app.use('/v1/user', userRouter);
export default app;
