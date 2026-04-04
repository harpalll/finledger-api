import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FinLedger API",
      version: "1.0.0",
      description: "Finance Data Processing & Access Control Backend",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
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
  apis: ["./src/modules/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);