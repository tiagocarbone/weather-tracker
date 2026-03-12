import express from 'express';
import apiRouter from './routes/api';
import { logger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(logger);

app.use('/api', apiRouter);

// Error handler should be last
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
app.listen(port, '0.0.0.0', () => {
   
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});
