import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import agendash from './routes/agendash';
import contact from './routes/contact';
import ContactMySQL from './routes/ContactMySQL';
import test from './routes/test'; // Add this

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	agendash(app);
	contact(app);
	ContactMySQL(app);
	test(app); 
	return app
}