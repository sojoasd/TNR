import env from "./utility/env";
import logger from "./utility/logger";
import express from "express";
import Mongodb from "./mongodb/index";
import RestfulAccount from "./restful-server/account";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/account", RestfulAccount);

app.use((error, req, res, next) => {
  logger.debug({ header: req.headers, body: req.body, message: error.message });
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.set("port", env.PORT);

app.listen(env.PORT, async () => {
  await Mongodb.init();
  logger.info(`Hello world app listening on port ${env.PORT}!`);
});
