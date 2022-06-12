import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/authRoute';
import comentRouter from './routes/comentRouter';
import postRouter from './routes/postRoute';
import userRouter from './routes/userRoute';

const app = express();

dotenv.config();

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(cors({ credentials: true, origin: true }));

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', postRouter);
app.use('/api', comentRouter);

export default app;
