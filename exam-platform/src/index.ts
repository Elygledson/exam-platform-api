import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import helmet from "helmet";
import { Request, Response } from "express";
import routes from "./routes";
import * as swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUI from "swagger-ui-express";
import config from "./config/config";
import { logErrors } from "./middleware/logErrors";
import { jsonErrorHandler } from "./middleware/jsonErrorHandler";
import { notFound } from "./middleware/notFound";

const dotenv = require("dotenv");
dotenv.config();

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();

    // setup express app
    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json());

    const swaggerSpec = swaggerJSDoc({
      swaggerDefinition: config.swaggerDefinition,
      apis: config.apis,
    });
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

    // register express routes from defined application routes
    app.use("/", routes);

    // error handlers
    app.use(logErrors);
    app.use(jsonErrorHandler);
    // 404 handler
    app.use(notFound);

    // start express server
    app.listen(process.env.PORT || 80, () => {
      console.log("Express server has started on port " + process.env.PORT);
    });
  })
  .catch((error) => console.log(error));
