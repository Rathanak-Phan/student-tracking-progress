import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Tracking API",
      version: "1.0.0",
      description: "API for Student Tracking System",
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
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
  apis: [`${process.cwd()}/src/modules/**/*.js`],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;