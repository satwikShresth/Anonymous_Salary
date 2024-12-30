import { Router } from "express";
import optionsRoutes from "./options.routes.ts";

export default () => {
  const router = Router();

  router.use("/options", optionsRoutes());

  return router;
};
