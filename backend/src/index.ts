import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import apiV1Routes from './routes/mods.ts';

const app = express();
const ENV = Deno.env.get('ENV');
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(morgan(':method :url :status'));
app.use('/api/v1', apiV1Routes());

app.use((req: Request, res: Response, next: NextFunction) => {
   const error = new Error(`Not Found: ${req.originalUrl}`);
   res.status(404);
   next(error);
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
   const status = res.statusCode !== 200 ? res.statusCode : 500;
   console.error(`Error: ${error.message}`);
   res.status(status).json({
      message: error.message,
      stack: error.stack,
   });
});

app.listen(PORT, () => {
   console.log(
      `🚀 Server running on http://localhost:${PORT}\n✨ Environment: ${ENV}`,
   );
});
