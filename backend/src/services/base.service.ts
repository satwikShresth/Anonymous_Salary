import { db } from 'db';
import { schema as sch } from 'db/schema';

export class BaseService {
   constructor(
      protected readonly database = db,
      protected readonly schema = sch,
   ) {}
}
