import { BaseService } from './base.service.ts';
import { eq } from 'drizzle-orm';

export class CompanyService extends BaseService {
   async findOrCreate(name: string) {
      const [company] = await this.database
         .select()
         .from(this.schema.company)
         .where(eq(this.schema.company.name, name))
         .limit(1)
         .then(async (records) => {
            if (records.length > 0) return records;
            return await this.database
               .insert(this.schema.company)
               .values({ name })
               .returning();
         });

      return company;
   }
}
