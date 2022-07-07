import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as BodyParser from 'body-parser';
import * as cors from 'cors';
import todoRoutes from './routes/todoRoutes';
import connectionOptions from './db/ormconfig';

createConnection(connectionOptions)
  .then(async () => {
    const app = express();
    app.use(cors());
    app.use(BodyParser.json());

    app.use('/todos', todoRoutes);

    app.listen(8000, () => console.log('App is running at port 8080.'));
  })
  .catch((error) => console.log(error));
