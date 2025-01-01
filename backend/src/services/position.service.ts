import { and, eq } from 'drizzle-orm';
import { BaseService } from './base.service.ts';

export class PositionService extends BaseService {
   async findOrCreate(name: string, companyId: number) {
      const [position] = await this.database
         .select()
         .from(this.schema.position)
         .where(
            and(
               eq(this.schema.position.name, name),
               eq(this.schema.position.companyId, companyId),
            ),
         )
         .limit(1)
         .then(async (records) => {
            if (records.length > 0) return records;
            return await this.database
               .insert(this.schema.position)
               .values({ name, companyId })
               .returning();
         });

      return position;
   }
}
