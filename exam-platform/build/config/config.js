"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    jwtSecret: "testing",
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API Exam Platform",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
        ],
    },
    apis: ["./src/routes/*.ts"],
};
//# sourceMappingURL=config.js.map