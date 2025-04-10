"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const express_openid_connect_1 = require("express-openid-connect");
const errorHandler_1 = require("./middleware/errorHandler");
const authConfig = {
    authRequired: true,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};
const app = (0, express_1.default)();
app
    .use((0, express_openid_connect_1.auth)(authConfig))
    .use((0, cors_1.default)())
    .use(express_1.default.json())
    .use(index_1.default)
    .get('/', (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        return res.oidc.login({ returnTo: '/api-docs' });
    }
    res.redirect('/api-docs');
})
    .use(errorHandler_1.errorHandler)
    .use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default))
    .use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: 'Oops. Something went wrong' });
});
exports.default = app;
