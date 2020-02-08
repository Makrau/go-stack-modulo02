import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.post('/', async (req, res) => {
  const user = await User.create({
    name: 'Usuario de Teste',
    email: 'email@teste.com',
    password_hash: '123123123',
  });

  return res.json(user);
});

export default routes;
