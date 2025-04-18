"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
process.env.NODE_ENV === 'production' ? dotenv_1.default.config() : dotenv_1.default.config({ path: './local.env' });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const PORT = process.env.PORT || 3000;
(async () => {
    await (0, db_1.connectToDatabase)();
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})();
