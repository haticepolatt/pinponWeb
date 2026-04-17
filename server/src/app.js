import express from "express";
import { applySecurity, csrfProtection } from "./middleware/security.js";
import router from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();
  applySecurity(app);
  app.use("/api", csrfProtection, router);
  app.use(notFound);
  app.use(errorHandler);
  return app;
};
