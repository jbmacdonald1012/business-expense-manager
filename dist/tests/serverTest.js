"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('Server - Basic Integration Test', () => {
    it('should respond with 404 for a non-existent route', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/non-existent-route');
        expect(res.status).toBe(404);
    });
});
