import {
   collegeYearType,
   coopCycleType,
   decisionType,
   offerStatusType,
   programLevelType,
   sourceType,
} from './enums.ts';
import {
   companyRelations,
   compensationRelations,
   locationRelations,
   majorRelations,
   minorRelations,
   positionRelations,
   submissionMajorRelations,
   submissionMinorRelations,
   submissionRelations,
} from './relations.ts';
import {
   company,
   compensation,
   compensationType,
   location,
   major,
   minor,
   submission,
   submissionMajor,
   submissionMinor,
} from './table.ts';

export const schema = {
   sourceType,
   collegeYearType,
   coopCycleType,
   decisionType,
   offerStatusType,
   programLevelType,
   submissionMinorRelations,
   submissionMajorRelations,
   positionRelations,
   minorRelations,
   majorRelations,
   locationRelations,
   compensationRelations,
   submissionRelations,
   companyRelations,
   company,
   compensation,
   compensationType,
   location,
   major,
   minor,
   submission,
   submissionMajor,
   submissionMinor,
};

export const organizedSchemas = {
   enums: {
      sourceType,
      collegeYearType,
      coopCycleType,
      decisionType,
      offerStatusType,
      programLevelType,
   },
   relations: {
      submissionMinorRelations,
      submissionMajorRelations,
      positionRelations,
      minorRelations,
      majorRelations,
      locationRelations,
      compensationRelations,
      submissionRelations,
      companyRelations,
   },
   tables: {
      company,
      compensation,
      compensationType,
      location,
      major,
      minor,
      submission,
      submissionMajor,
      submissionMinor,
   },
};