import { Router } from 'express';
import optionsRoutes from './options.routes.ts';
import submitRoutes from './submit.routes.ts';

export default () => {
   const router = Router();

   router.use('/options', optionsRoutes());
   router.use('/form', submitRoutes());

   return router;
};
