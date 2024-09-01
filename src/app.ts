import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';

import { cardRouter, userRouter } from './routes';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

//Временное решение
app.use((req: Request & { user?: { _id: string } }, res: Response, next: NextFunction) => {
  req.user = {
    _id: '66d1cc0cf137e5b4ee421980', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errors());

app.use((err: Error & { statusCode: number }, req: Request, res: Response) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(+PORT, () => {
  console.log(`Server started on port  ${PORT}`);
});
