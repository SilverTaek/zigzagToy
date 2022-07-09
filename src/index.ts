import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as BodyParser from 'body-parser';
import * as cors from 'cors';
import todoRoutes from './routes/TodoRoutes';
import connectionOptions from './common/config/environment';

createConnection(connectionOptions)
  .then(async () => {
    const app = express();
    app.use(cors());
    app.use(BodyParser.json());

    app.use('/todos', todoRoutes);

    app.listen(8080, () => console.log('App is running ...!'));
  })
  .catch((error) => console.log(error));
