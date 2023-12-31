import { errorHandler } from './error-handler';
import { jwtMiddleware } from './jwt-middleware';

export { apiHandler };

function apiHandler(handler: any) {
  return async (req: any, res: any) => {
    try {
      // global middleware
      await jwtMiddleware(req, res);

      // route handler
      await handler(req, res);
    } catch (err) {
      // global error handler
      errorHandler(err, res);
    }
  };
}
