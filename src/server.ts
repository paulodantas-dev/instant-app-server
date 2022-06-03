import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/authRoute';

const app = express();

dotenv.config();

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(cors());

app.use('/api', authRouter);

export default app;
