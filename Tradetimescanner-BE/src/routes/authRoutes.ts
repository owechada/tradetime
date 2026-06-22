import { Router } from 'express';
import { signup, login, ResetPassword, googleLogin } from '../controllers/authController';

const authrouter = Router();
authrouter.post('/signup', signup);
authrouter.post('/login', login);
authrouter.post('/google-login', googleLogin);
authrouter.post('/resetpass', ResetPassword);

export default authrouter;
