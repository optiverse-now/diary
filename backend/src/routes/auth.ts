import { Hono } from 'hono';
import { signUp, signIn } from '../controllers/auth';

const auth = new Hono();

auth.post('/signup', signUp);
auth.post('/signin', signIn);

export default auth; 