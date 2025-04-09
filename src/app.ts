import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from '../';
import { auth } from 'express-openid-connect';
import { errorHandler } from './middleware/errorHandler';

const authConfig = {
    authRequired: true,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

const app = express();

app
    .use(auth(authConfig))
    .use(cors())
    .use(express.json())
    .use(routes)
    .get('/', (req, res) => {
        if (!req.oidc.isAuthenticated()) {
            return res.oidc.login({ returnTo: '/api-docs' });
        }
        res.redirect('/api-docs');
    })
    .use(errorHandler)
    // .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    .use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(error);
        res.status(500).json({ message: 'Oops. Something went wrong' });
    });

export default app;