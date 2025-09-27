import swaggerJSDoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Payroll Management API",
            version: "1.0.0",
            description: "API for managing payroll, payments, and dashboard",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts"], // Paths to files containing OpenAPI definitions
};
const specs = swaggerJSDoc(options);
export default specs;
//# sourceMappingURL=swagger.js.map