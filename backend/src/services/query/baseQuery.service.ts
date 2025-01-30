import { BaseService } from '../base.service.ts';

export class BaseQueryService extends BaseService {
   protected createPaginationParams(rawLimit?: string, cursor?: string) {
      const limit = Math.min(parseInt(rawLimit || '10'), 50);
      return {
         limit,
         offset: cursor ? parseInt(cursor) : undefined,
      };
   }
}
