import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';

import auth from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.put('/users', auth, UserController.update);

routes.post('/sessions', SessionController.store);

routes.post('/files', auth, upload.single('file'), FileController.store);

routes.get('/providers', auth, ProviderController.index);

routes.get('/appointments', auth, AppointmentController.index);
routes.post('/appointments', auth, AppointmentController.store);

export default routes;
