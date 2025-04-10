"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const swaggerAutogenInstance = (0, swagger_autogen_1.default)();
const doc = {
    info: {
        title: "Business Expense Manager",
        description: "An API to manage events and bookings",
        version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ['http'],
};
const outputFile = "./swagger.json";
const endpointsFiles = [
    './src/app.ts',
];
swaggerAutogenInstance(outputFile, endpointsFiles, doc);
