import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { applySecurity, csrfProtection } from "./middleware/security.js";
import router from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createApp = () => {
  const app = express();
  applySecurity(app);
  app.use("/api", csrfProtection, router);

  if (process.env.NODE_ENV === "production") {
    const clientBuild = path.resolve(__dirname, "../../client/dist");
    app.use(express.static(clientBuild));
    app.get("*", (req, res) => {
      res.sendFile(path.join(clientBuild, "index.html"));
    });
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
};