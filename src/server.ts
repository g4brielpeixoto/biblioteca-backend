import express from 'express';
import { router } from './router';
import cors from 'cors';

const app = express();
app.use(express.json());
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(router);

app.listen(3000, () => console.log('🔥 Server is runnin on port 3000'));
